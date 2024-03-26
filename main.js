cat_add("chargement...","neg white bold");
let span_loading_begin=Date.now();//new getting timespan for time difference
let span_loading_end=0;


const sett_dec=1;
const sett_interval=20;
const sett_counterClockwise=false;
const sett_counterOne=false;
//120 fps : 8.3
//60 fps : 16.6

//--- initialization ---
//the script is loaded when the page is totaly loaded
/**
 * it is realy fast, and allways used.
 */

let span_subloading_begin=Date.now();
cat_add("variables...","neg gray");


let timer_start=false;//if timer started
let timer_pause=false;//if timer paused

let timer_span_fresh_ms=0.;//the difference for calculation
let timer_stamp_begin=0.;//the begin timestamp
let timer_span_max=0.;//the finish timestamp
let timer_stamp_end=0.;//the end timestamp (when paused)
let timer_span_gap=0.;//the gap (if has paused) timestamp
let timer_reverse=false;//if countdown, else countup
let timer_id=0;

let display_timer_is_m=true;
let display_timer_is_r=true;


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
let display_text_title=document.getElementById("text_title");
let display_text_comment=document.getElementById("text_comment");

let display_vector_line=document.getElementById("vector_dynamic_line");
let display_vector_arc=document.getElementById("vector_dynamic_arc");

let display_button_start=document.querySelectorAll(".button.start")[0];
let display_button_pause=document.querySelectorAll(".button.pause")[0];
let display_button_continue=document.querySelectorAll(".button.continue")[0];




cat_add(`variables en ${Date.now() - span_subloading_begin} ms`,"neg gray");



//--- class/queue ---

let queue_elements=[]
let queue_index=-1

class Queue {
	constructor(f_time_max, f_sett_loop, f_display_name="defaut") {
		this.m_remain_loop=f_sett_loop;
		
		this.m_sett_loop=f_sett_loop;
		this.m_sett_time=f_time_max;
		
		this.m_display_wise=true;
		this.m_display_name=f_display_name;
		this.m_display_color_back="#fff";
		this.m_display_color_things="#fff";
	}
}



function chrono_queue_next()
{
	if (queue_index<0)
	{
		queue_index=0;
	} else {//if is not -1
		queue_elements[queue_index].m_remain_loop-=1;
		let here_up=false;
		if (queue_elements[queue_index].m_remain_loop===0)
		{
			here_up=true;
		}

		if (here_up)
		{//you go to bigger wait
			queue_elements[queue_index].m_remain_loop=queue_elements[queue_index].m_sett_loop;
			queue_index++;
		} else {//you back to first wait
			queue_index=0;
		}
	}

	if (queue_index<0)
	{//when down from 0
		//when you next, < 0 not allowed
		queue_index=0;
	}
	if (queue_index>=queue_elements.length)
	{//when finish
		queue_index=-1;
		return false;
	}

	return true;
}

function chrono_queue_here()
{
	return queue_elements[queue_index];
}



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





//--- functions/clock ---
/**
 * clock things. countup or countdown.
 */

function chrono_clock_start(f_end=0)
{
	timer_start=true;
	timer_pause=false;
	timer_id++;//new timer
	timer_stamp_begin=Date.now();//begin
	timer_span_max=f_end;//end
	timer_reverse=f_end>0;

	if (timer_reverse)
	{
		cat_add(`${chrono_queue_here().m_display_name} : ${f_end/1000}s`,"yellow");
		chrono_countdown_recursive(timer_id);
	}
	else
	{
		cat_add(`chronomètre commencé`,"yellow");
		chrono_countup_recursive(timer_id);
	}
}

function chrono_clock_pause()
{
	timer_pause=true;
	timer_id++;//quit timer
	timer_stamp_end=Date.now();//begin
	
	//cat_add(`pause`,"white");
	chrono_display_timer_refresh();
}


function chrono_clock_continue()
{
	timer_pause=false;
	timer_id++;//new timer
	timer_stamp_begin+=(Date.now() - timer_stamp_end);//correct things

	//cat_add(`continue`,"white");
	if (timer_reverse)
	{
		chrono_countdown_recursive(timer_id);
	}
	else
	{
		chrono_countup_recursive(timer_id);
	}
}




function chrono_clock_o()
{
	timer_id++;//delete timer
	timer_span_fresh_ms=0;
	chrono_display_timer_refresh();
}


function chrono_next()
{
	//finish
	timer_start=false;
	timer_pause=false;
	//set to 0
	chrono_clock_o();

	//go next
	if (chrono_queue_next())//do next and check if has next
	{
		chrono_clock_start(queue_elements[queue_index].m_sett_time);
	} else {
		cat_add(`fini !`,"green");
	}
}

function chrono_countdown_next()
{
	chrono_next();
}



function chrono_countup_recursive(f_id)
{
	if (timer_id===f_id)
	{
		timer_span_fresh_ms = Date.now() - timer_stamp_begin;//ms
		chrono_display_timer_refresh();
		setTimeout(chrono_countup_recursive,sett_interval,f_id);
	}
}

function chrono_countdown_recursive(f_id)
{
	if (timer_id===f_id)
	{
		timer_span_fresh_ms = timer_stamp_begin + timer_span_max - Date.now();//ms
		chrono_display_timer_refresh();
		if (timer_span_fresh_ms<0)
		{
			chrono_countdown_next();
		} else {
			setTimeout(chrono_countdown_recursive,sett_interval,f_id);
		}
	}
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
 * initialize the timer UI
 */
function chrono_display_timer_init()
{
	{//trigger decimals
		if (sett_dec===0)
		{//dec off
			display_timer[0].style.display="none";
			display_timer_wrap[1].style.display="none";
		}
	}
	
	//trigger all
	display_timer_is_r=!(timer_reverse && timer_span_fresh_ms>0);
	display_timer_is_m=!(timer_span_fresh_ms>60000);

	chrono_display_timer_refresh();
}






/**
 * refresh the timer UI
 * MUST be executed when a visible change is made
 */
function chrono_display_timer_refresh()
{
	//tick
	{
		{//text
			{//trigger minute
				let here_mIs=timer_span_fresh_ms>60000;
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
			let here_time=parseInt(timer_span_fresh_ms/10**(3-sett_dec));
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

		{//vector
			{//trigger dynamic
				if (display_timer_is_r != (timer_reverse && timer_span_fresh_ms>0))
				{
					display_timer_is_r=(timer_reverse && timer_span_fresh_ms>0);
					if (display_timer_is_r)
					{
						display_vector_line.style.display="none";
						display_vector_arc.style.display="";
					}
					else
					{
						display_vector_line.style.display="none";
						display_vector_arc.style.display="none";
					}
				}
			}

			if (timer_reverse)
			{
				let here_fract=timer_span_fresh_ms/timer_span_max;
				if (sett_counterOne)
					here_fract=1-here_fract;
				
				display_text_comment.innerHTML=String(parseInt(here_fract*100))+"%";//!
				
				let here_x=500+( Math.cos(Math.PI*2*here_fract-Math.PI/2) *400);
				let here_y=500+( Math.sin(Math.PI*2*here_fract-Math.PI/2) *400);

				//display_vector_line.setAttribute("x1",String(here_x));
				//display_vector_line.setAttribute("y1",String(here_y));

				if (sett_counterClockwise)
					if (here_fract<=1/2)
						display_vector_arc.setAttribute("d",`M ${here_x} ${here_y} A 400 400 0 1 1 500 100`);
					else
						display_vector_arc.setAttribute("d",`M ${here_x} ${here_y} A 400 400 0 0 1 500 100`);
				else
					if (here_fract<=1/2)
						display_vector_arc.setAttribute("d",`M 500 100 A 400 400 0 0 1 ${here_x} ${here_y}`);
					else
						display_vector_arc.setAttribute("d",`M 500 100 A 400 400 0 1 1 ${here_x} ${here_y}`);
			}
		}
	}


	//change
	display_button_pause.style.margin="10px";
	if (timer_start)
	{
		display_button_start.style.display="none";
		if (timer_pause)
		{
			display_button_continue.style.display="";
			display_button_pause.style.display="none";
		} else {
			display_button_continue.style.display="none";
			display_button_pause.style.display="";
		}
	} else {
		display_button_continue.style.display="none";
		display_button_pause.style.display="none";
		display_button_start.style.display="";
	}
}


cat_add(`fonctions en ${Date.now() - span_loading_begin} ms`,"neg gray");


//--- functions/action ---

function chrono_action_start()
{
	chrono_next();
}
function chrono_action_continue()
{
	chrono_clock_continue();
}
function chrono_action_pause()
{
	chrono_clock_pause();
}


//--- launcher ---

chrono_display_timer_init();

queue_elements.push(new Queue(45000,1,"l1"));
queue_elements.push(new Queue(15000,3,"l2"));
queue_elements.push(new Queue(360000,2,"l3"));


cat_add("prêt !","neg magenta bold");

//chrono_clock_start(10000);

//timer_stamp_begin=Date.now();//begin
//timer_span_max=10000;//end
//timer_reverse=true;
//timer_span_fresh_ms=0;
//chrono_display_timer_refresh();

