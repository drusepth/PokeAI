$(document).ready(function () {
  set_battle_format('OU');
  set_team('[OU] Ankov');
  queue_for_battle();
 
  function logic() {  
	  // Treat each turn as its own state because yolo
    var active_moves  = get_active_moves(),
        move_types    = get_active_move_types(),
        enemy_pokemon = get_enemy_active_name();
    
    var enemy_types = get_types(enemy_pokemon);

    // If we're trying to choose a lead pokemon, send out the first one
    if ($('.whatdo').text().split(' ')[0] == 'How') {
      switch_to_nth_pokemon(0);
    }
    
    // If we don't have an active pokemon out, send one out
    if ($('.whatdo').text().split(' ')[0] == "Switch") {
      console.log("Switching pokemans");

      // Find the switchable pokemon with the strongest move against active enemy
      var switchable_pokemon = get_switchables(),
          switch_ranking = [];

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
    
    // Rank each of our moves by effectiveness * power * accuracy
    var move_ranking = [];
    $.each(active_moves, function (n) {
      var multiplier  = effectiveness_multiplier(move_types[n], enemy_types),
          move_rating = get_move_rating(active_moves[n]);
      var rank = move_rating * multiplier;
      move_ranking.push({"move": active_moves[n], "rank": rank});
    });
    
    // Sort move_ranking by each move's potential damage ranking...
    move_ranking.sort(function (a, b) {
      return b.rank - a.rank;
    });
    
    // And use the highest-ranked skill!
    use_move(move_ranking[0]['move']);
    
  }
  
  // Register our AI to be called every turn
  register_ai(logic);
});