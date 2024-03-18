cat_add("chargement...","neg white bold");
let span_loading_begin=Date.now();//new getting timespan for time difference
let span_loading_end=0;
//let span_timer_begin=0;
//let span_timer_end=0;


//--- initialization ---
//the script is loaded when the page is totaly loaded
/**
 * it is realy fast, and allways used.
 */

let span_subloading_begin=Date.now();
cat_add("variables...","neg gray");


let display_block_side=document.getElementById("side");


cat_add(`variables en ${Date.now() - span_subloading_begin} ms`,"neg gray");


//--- functions/use ---
//useful functions
/**
 * all thes function are pretty simple, but realy useful.
 */

cat_add("fonctions...","neg gray");
span_subloading_begin=Date.now();


/**
 * return random integer from range [0,f_range[
 * @param {int} f_range define the range for the integer
 * @returns {int} a random integer in the f_range range
 */
function chrono_use_rickroll(f_range)
{
  return Math.floor(Math.random() * f_range);
}

/**
 * chane the case to the setting
 * @param {String} f_str the origin string upper &| lower
 * @param {Boolean} f_upper is uppercase. else, lowercase
 * @returns the string in the good case
 */
function chrono_use_text_case(f_str, f_upper)
{
	//if (sett_display_upper)
	if (f_upper)
		return f_str.toUpperCase();
	else
		return f_str.toLowerCase();
}

/**
 * tool for conditionnaly display plural element
 * @param {float} f_num the value to check
 * @param {String} f_end the plural element
 * @returns plural element if plural
 */
function chrono_use_plural(f_num,f_end="s")
{
	if (f_num<2)
		return "";
	else
		return f_end;
}

//--- functions/game ---
//game function
/**
 * thes functions are used dirrectly by the game.
 * only not visible action.
 */



/***
 * game state switch
 */
function chrono_game_switch()
{
}

//--- functions/display ---
/**
 * all function in order to display elements on the web page.
 * you can change display functions to have a totaly different look, without touching game functions
 */


/**
 * apply display values each time you edit the game state
 * @param {int} f_state the new game state
 */
function chrono_display_switch(f_state)
{
}


cat_add(`fonctions en ${Date.now() - span_loading_begin} ms`,"neg gray");
