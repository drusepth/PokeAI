$(document).ready(function () {
  var bot = PokemonBot();
  
  //bot.logic.lead.unshift(function () { lead_pokemon_logic(); }); // leave default lead functionality
  bot.logic.switch.unshift(function () { shift_select_logic(); });
  bot.logic.turn.unshift(function () { move_selection_logic(); });
  
  bot.queue_matches('OU', 'Ankov-A1', 100); // woohoo!
 
  // Rank each of our moves by effectiveness * power * accuracy and use the move with the
  // highest score
  function move_selection_logic() {
    var active_moves  = get_active_moves(),
        move_types    = get_active_move_types(),
        enemy_pokemon = get_enemy_active_name(),
        enemy_types = get_types(enemy_pokemon),
        move_rankings = [];
        
    $.each(active_moves, function (n) {
      var multiplier  = effectiveness_multiplier(move_types[n], enemy_types),
          move_rating = get_move_rating(active_moves[n]);
      var rank = move_rating * multiplier;
      move_rankings.push({"move": active_moves[n], "rank": rank});
    });
    
    // Sort move_rankings by each move's potential damage ranking...
    move_rankings.sort(function (a, b) {
      return b.rank - a.rank;
    });
    
    // And use the highest-ranked skill!
    use_move(move_rankings[0]['move']);
  }
  
  // Find the switchable pokemon with the strongest move against active enemy
  function shift_select_logic() {
    var switchable_pokemon = get_switchables(),
        enemy_pokemon = get_enemy_active_name(),
        switch_ranking = [],
        enemy_types = get_types(enemy_pokemon);

    $.each(switchable_pokemon, function (i) {
      var moves    = get_moves_for(switchable_pokemon[i]),
          max_rank = 0;

      // Find the highest-ranked move for this pokemon and assign its rank
      // to the pokemon's rank
      $.each(moves, function (j) {
        var move_type = get_move_type(moves[j]);
        var rank = get_move_rating(moves[j]) * effectiveness_multiplier(move_type, enemy_types);
        max_rank = Math.max(max_rank, rank);
      });
      
      switch_ranking.push({"pokemon": switchable_pokemon[i], "rank": max_rank});
    });
    
    // Sort pokemon by most likely to KO the enemy next turn
    switch_ranking.sort(function (a, b) {
      return b.rank - a.rank;
    });
    
    switch_to_pokemon(switch_ranking[0]['pokemon']);
  }

});
