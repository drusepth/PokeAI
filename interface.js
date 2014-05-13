/* Works when called after page load, but not on page load -- dunno lel
function join_chat_room(room_name) {
  console.log('Joining chat room ' + room_name);

  // Join the chosen chat room
  $('.roomlist')
    .find('div > a')
    .filter(function () {
      return $(this).find('strong').text().trim() == room_name; })
    .click();
}
*/

function set_battle_format(format_name) {
  console.log('Selecting format ' + format_name);

  // Open format select menu
  $('.formatselect').click();
  
  // Select the chosen format
  $('.ps-popup')
    .find('li > button')
    .filter(function () { return $(this).text() == format_name; })
	.click();
}

function set_team(team_name) {
  console.log('Selecting team ' + team_name);

  // Open team select menu
  $('.teamselect').click();
  
  // Choose given team
  $('.ps-popup')
    .find('li > button')
	.filter(function () { return $(this).text() == team_name; })
	.click();
}

function queue_for_match() {
  console.log('Queuing for battle');

  $('.big.button').click();
}

function not_in_match() {
  return $('.button.closable').length < 1;
}

function register_ai(logic_function) {
  console.log('Registering AI');

  setInterval(function () {
    // If we're still waiting, do nothing:
    if ($('.battle-controls > .controls').text().split('...')[0] == 'Waiting for opponent') {
      return;
    }
    
    // If the client is accepting moves, call the AI's logic function
    logic_function();
  }, 10000);
}

function send_chat_message(message) {
  console.log('Sending chat message: ' + message);

  $('.chatbox').first().find('textarea').val(message).submit();
}

function use_nth_move(n) { // 0-indexed
  console.log('Using nth move where n=' + n);

  $('.movemenu').find('button')[n].click();
}

function get_nth_move_type(n) {
  console.log('Getting nth move type');
  
  return $($('.movemenu').find('button')[n]).attr('class').split('-')[1];
}

function use_move(move_name) {
  console.log('Using move: [' + move_name.trim() + ']');

  $('.movemenu')
    .find('button')
    .filter(function (i) {
      return $(this).clone().children().remove().end().text().trim() == move_name.trim()
    })
    .click();
}

// Returns a list of switchable pokemon
function get_switchables() {
  var pokemans = [];
  $.each($('.switchmenu > button').not(':disabled'), function (i) {
    pokemans.push($(this).text());
  });
  return pokemans;
}

// Returns list of moves for the current active pokemon
function get_active_moves() {
  var moves = [];
  $.each($('.movemenu > button').not(':disabled'), function (i) {
    moves.push($(this).clone().children().remove().end().text());
  });
  return moves;

}
// Returns list of move types for the current active pokeman
function get_active_move_types() {
  var types = [];
  $.each($('.movemenu > button').not(':disabled'), function (i) {
    types.push($(this).attr('class').split('-')[1]);
  });
  return types;
}

// Returns names of moves for a switchable pokemon
function get_moves_for(pokemon_name) {
  $('.switchmenu')
    .find('button')
    .filter(function (i) { return $(this).text().trim() == pokemon_name.trim(); })
    .trigger('mouseover');
  return $('.tooltip > .section').text().split(decodeURIComponent('%E2%8B%85') + ' ').slice(1, 5);
}

// Returns name of opposing enemy pokemon
function get_enemy_active_name() {
  return $('.lstatbar').text().split(' ')[0];
}

// Returns effectiveness multiplier for type A attacking type B
function effectiveness(attack_type, defender_type) {
  return effectiveness_chart[defender_type].damageTaken[attack_type];
}

// for defender_types as an array # todo actually check
function effectiveness_multiplier(attack_type, defender_types) {
  var effectiveness_multiplier = 1;
  $.each(defender_types, function (j) {
    var modifier = effectiveness(attack_type, defender_types[j]);
    if (!isNaN(modifier)) {
      effectiveness_multiplier *= modifier;
    }
  });
  
  return effectiveness_multiplier;
}

function get_types(pokemon_name) {
  var entry = pokedex[pokemon_name.replace('-', '').toLowerCase()];
  if (entry) {
    return entry.types;
  } else {
    return [];
  }
}

function get_move_rating(move_name) {
  var move_info = get_move_info(move_name);
  return (1.0 * move_info.basePower) * (1.0 * move_info.accuracy);
}

function get_move_info(move_name) {
  var sanitized_name = move_name.replace(/[\s\-]/g, '').toLowerCase().trim();
  return movedex[sanitized_name];
}

function get_move_type(move_name) {
  var move_info = get_move_info(move_name);
  return (move_info ? move_info.type : "");
}

function switch_to_nth_pokemon(n) {
  console.log("Switching pokemon, n=" + n);
  $('.switchmenu').find('button')[n].click()
}

function switch_to_pokemon(pokemon_name) {
  console.log('Switching to ' + pokemon_name);
  $('.switchmenu')
    .find('button')
    .filter(function (i) { return $(this).text().trim() == pokemon_name.trim(); })
    .click();
}

function match_is_over() {
  return $('.messagebar.message').text().split(' ').slice(-2).join(' ') == 'the battle!';
}

function currently_queueing() { 
  return $('.big.button').hasClass('disabled');
}