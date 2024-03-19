cat_add("chargement...","neg white bold");
let span_loading_begin=Date.now();//new getting timespan for time difference
let span_loading_end=0;
//let span_timer_begin=0;
//let span_timer_end=0;



const sett_dec=1;

//--- initialization ---
//the script is loaded when the page is totaly loaded
/**
 * it is realy fast, and allways used.
 */

let span_subloading_begin=Date.now();
cat_add("variables...","neg gray");


let timer_diff_ms=0.;
let timer_begin=0.;

let display_timer_is_m=true;


let display_timer=
[
	document.getElementById("timer_ms"),
	document.getElementById("timer_s"),
	document.getElementById("timer_m")
]
let display_timer_wrap=
[
	document.getElementById("timer_wrap1"),
	document.getElementById("timer_wrap2")
]



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





//--- functions/timer ---
/**
 * juste timer.
 */



function chrono_clock_start()
{
	timer_begin=Date.now();
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

/**
 * refresh the display
 * MUST be executed when a visible change is made
 */
function chrono_display_refresh()
{
	{//trigger minute
		let here_mIs=timer_diff_ms>60000;
		if (display_timer_is_m != here_mIs)
		{
			display_timer_is_m = here_mIs;
			if (display_timer_is_m)
			{//minutes on
				display_timer[2].style.display="";
				display_timer_wrap[0].style.display="";
			}
			else 
			{//minutes off
				display_timer[2].style.display="none";
				display_timer_wrap[0].style.display="none";
			}
		}
	}



	//each digits
	let here_time=parseInt(timer_diff_ms/10**(3-sett_dec));
	{
		let here_parth=here_time%10**sett_dec;
		here_time=parseInt(here_time/10**sett_dec);
		
		let here_text=String(here_parth);
		while (here_text.length<sett_dec)
		{
			here_text="0"+here_text;
		}
		display_timer[0].innerHTML=here_text;
	}

	{
		let here_parth=here_time%60;
		here_time=parseInt(here_time/60);
		
		let here_text=String(here_parth);
		if (display_timer_is_m)
		{
			while (here_text.length<2)
			{
				here_text="0"+here_text;
			}
		}
		display_timer[1].innerHTML=here_text;
	}

	if (display_timer_is_m)
	{
		let here_parth=here_time;
		display_timer[2].innerHTML=String(here_parth);
	}
}


cat_add(`fonctions en ${Date.now() - span_loading_begin} ms`,"neg gray");

chrono_clock_start();

/**
 * for the timer
 * executed each 10ms
 */
setInterval(
function(){//anonymous function
timer_diff_ms = Date.now() - timer_begin;//ms
chrono_display_refresh();
}, 10**(2-sett_dec));