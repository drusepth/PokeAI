/*
 * Defines a Pokemon Bot capable of automated battles on Pokemon Showdown
 * with hooks for writing a competitive AI. 
 *
 * Usage:
 *     var bot = PokemonBot();
 *     bot.logic.lead.unshift(function () { lead_pokemon_logic(); });
 *     bot.logic.switch.unshift(function () { shift_select_logic(); });
 *     bot.logic.turn.unshift(function () { move_selection_logic(); });
 *
 *     bot.queue_matches('OU', 'Team Name', 500); // woohoo!
 *
 * Available logic hooks are below:
 *   - Lead:   Logic run at the start of the match, to choose a lead Pokemon
 *   - Switch: Logic run whenever you are prompted to switch a Pokemon
 *   - Turn:   Logic run whenever an active Pokemon is ready to make a move this turn
 *
 * Each hook is an ordered array of functions, allowing Bot instances to override the
 * original functionality with
 *
 *     bot.logic.lead = function () { do_stuff(); };
 *
 * or keep that functionality as "backup" with
 *
 *     bot.logic.lead.unshift(function () { do_stuff(); });
 *
 * in which the user's do_stuff() function will be called, but if it does not result in
 * an action, the next function in the list will be run, and so on.
 *
 * Multiple functions of tiered decision-making can be added by simply unshifting
 * each desired function onto the relevant hook in the desired order.
 */

function PokemonBot() {
  var bot = {
    // Define a container for the various logic hooks
    logic: {
      // By default, lead with the first Pokemon in your party
      lead: [function () { switch_to_nth_pokemon(0); }],
      
      // By default, switch to the first available Pokemon when switching
      switch: [function () { switch_to_pokemon($(get_switchables()).first()); }],
      
      // By default, use the first available move when attacking
      turn: [function () { use_move($(get_active_moves()).first()); }]
    },
    
    // Define an event to manage games, GG'ing out of old ones and starting new ones
    queue_matches: function (battle_format, team_name, amount) {
    
      // Go in with the right team/format!
      set_battle_format(battle_format);
      set_team(team_name);
    
      // Queue up X matches
      var matches_left = amount;
      var match_watcher = setInterval(function () {
        if ((not_in_match() || match_is_over()) && !currently_queueing() && matches_left > 0) {
          console.log(matches_left + ' matches left to play');
          send_chat_message('gg');
          
          // Close the last match's window
          if ($('.closebutton').length > 0)
            $('.closebutton')[0].click();
          
          // And queue up again in 5 seconds
          setTimeout(function () { queue_for_match(); }, 5000);
          
          // And decrement the number of matches left to play
          matches_left--;
        }
      }, 20000);
    }
    
  };
  
  // Set up the hooks
  bot.hooks = {
    // Call "Lead" logic when the starting "How do you want to start?" message is showing
    lead: setInterval(function () {
      if ($('.whatdo').text().split(' ')[0] == 'How')
        bot.logic.lead.forEach(function (handler) { handler(); });
    }, 9000),
    
    // Call "Switch" logic when the "Switch to what Pokemon?" message is showing
    switch: setInterval(function () {
      if ($('.whatdo').text().split(' ')[0] == 'Switch')
        bot.logic.switch.forEach(function (handler) { handler(); });
    }, 7000),
    
    // Call "Turn" logic when "What will X do?" message is shown for active Pokemon
    turn: setInterval(function () {
      if ($('.whatdo').text().split(' ')[0] == 'What')
        bot.logic.turn.forEach(function (handler) { handler(); });
    }, 5000),
  };
  
  return bot;
}