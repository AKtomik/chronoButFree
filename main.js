cat_add("chargement...","neg white bold");
let span_loading_begin=Date.now();//new getting timespan for time difference
let span_loading_end=0;


const sett_dec=1;
const sett_interval=20;
//120 fps : 8.3
//60 fps : 16.6
const sett_fillContrary=false;//force fill to be contrary to the last (avoid)

const sett_menu_maxqueue=7;

//--- initialization ---
//the script is loaded when the page is totaly loaded
/**
 * it is realy fast, and allways used.
 */

let span_subloading_begin=Date.now();
cat_add("variables...","neg gray");


let timer_started=false;//if timer started
let timer_paused=false;//if timer paused

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

let display_texts_c1_fill=document.querySelectorAll(".style_c1.fill");
let display_texts_c1_stroke=document.querySelectorAll(".style_c1.stroke");
let display_texts_c1_text=document.querySelectorAll(".style_c1.text");
let display_texts_c2_back=document.querySelectorAll(".style_c2.back");

let display_options_itms_grandfather=document.querySelector(".itms");

let display_menu_actual=0;
let display_menus=[
	0,
	document.querySelectorAll(".menu.first"),
	document.querySelectorAll(".menu.second"),
	document.querySelectorAll(".menu.last"),
]


cat_add(`variables en ${Date.now() - span_subloading_begin} ms`,"neg gray");



//--- class/queue ---

let queue_elements=[]
let queue_index=-1

class Queue {
	constructor(f_time_max,f_sett_loop,f_sett_rstrip=false, f_display_name="timer",f_display_fill=false,f_display_wise=true,f_display_c1="#ffff",f_display_c2="#000f") {

		this.m_remain_loop=f_sett_loop;
		
		this.m_sett_loop=f_sett_loop;
		this.m_sett_time=f_time_max;
		this.m_sett_rstrip=f_sett_rstrip;
		
		this.m_display_name=f_display_name;
		this.m_display_wise=f_display_wise;
		this.m_display_fill=f_display_fill;
		this.m_display_c1=f_display_c1;
		this.m_display_c2=f_display_c2;
	}
}



function chrono_queue_next()
{

	if (queue_index<0)
	{
		queue_index=0;
	} else {//if is not -1
		let last_index=queue_index;
		
		queue_elements[queue_index].m_remain_loop-=1;
		let here_up=false;
		if (queue_elements[queue_index].m_remain_loop===0)
		{
			here_up=true;
		}

		if (here_up)
		{//you go to bigger wait
			if (queue_index+1===queue_elements.length)
			{//when finish 1
				queue_elements[queue_index].m_remain_loop=queue_elements[queue_index].m_sett_loop;
				queue_index=-1;
				return false;
			} else {
				queue_elements[queue_index].m_remain_loop=queue_elements[queue_index].m_sett_loop;
				queue_index++;
				if (queue_elements[queue_index].m_sett_rstrip)
				{//
					//(queue_index<queue_elements.length) && 
					while (queue_elements[queue_index].m_remain_loop===1)
					{
						if (queue_index+1===queue_elements.length)
						{//when finish 2
							queue_elements[queue_index].m_remain_loop=queue_elements[queue_index].m_sett_loop;
							queue_index=-1;
							return false;
						}
						queue_elements[queue_index].m_remain_loop=queue_elements[queue_index].m_sett_loop;
						queue_index++;
					}
				}
			}
		} else {//you back to first wait
			queue_index=0;
		}
		
		if (sett_fillContrary)
			queue_elements[queue_index].m_display_fill=!(queue_elements[last_index].m_display_fill);
	}
	

	if (queue_index<0)
	{//when down from 0
		//when you next, < 0 not allowed
		queue_index=0;
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
	if (!timer_started)
	{
		timer_started=true;
		timer_paused=false;
		timer_id++;//new timer
		timer_stamp_begin=Date.now();//begin
		timer_span_max=f_end-1;//end
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

		chrono_display_action_start();
	}
}

function chrono_clock_pause()
{
	if (timer_started && !timer_paused)
	{
		timer_paused=true;
		timer_id++;//quit timer
		timer_stamp_end=Date.now();//begin
		
		//cat_add(`pause`,"white");
		chrono_display_timer_refresh();
	}
}


function chrono_clock_continue()
{
	if (timer_started && timer_paused)
	{
		timer_paused=false;
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
	timer_started=false;
	timer_paused=false;
	//set to 0
	chrono_clock_o();

	//go next
	if (queue_elements.length===0)
	{//countup special case
		//chrono_display_color(chrono_queue_here().m_display_c1,chrono_queue_here().m_display_c2);
		chrono_clock_start(0);
	}
	else if (chrono_queue_next())//do next and check if has next
	{
		chrono_display_color(chrono_queue_here().m_display_c1,chrono_queue_here().m_display_c2);
		chrono_clock_start(chrono_queue_here().m_sett_time);
	} else {
		chrono_display_color("#000","#fff");
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
 * apply display values each time you edit the menu
 * @param {int} f_state the new menu
 */
function chrono_display_menu_switch(f_state)
{
	//console.log(`switch ${f_state} from ${display_menu_actual}`)
	//out
	if (display_menu_actual===1)
	{
		chrono_clock_pause();
		for (const v of display_menus[1])
		{
			v.style["opacity"]="0";
			v.style["display"]="none";
		}
	}
	if (display_menu_actual===2)
	{
		chrono_options_read_all()//!
		for (const v of display_menus[2])
		{
			v.style["opacity"]="0";
			v.style["display"]="none";
		}
	}
	
	display_menu_actual=f_state;

	//in
	if (display_menu_actual===1)
	{
		for (const v of display_menus[1])
		{
			v.style["opacity"]="1";
			v.style["display"]="";
		}
	}
	if (display_menu_actual===2)
	{
		chrono_options_write_all()//!
		for (const v of display_menus[2])
		{
			v.style["opacity"]="1";
			v.style["display"]="";
		}
	}
	for (const v of display_menus[3])
	{
		v.style["opacity"]="1";
		v.style["display"]="";
	}
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

	chrono_display_color("#000","#fff");
	chrono_display_timer_refresh();
}



function chrono_display_action_start()
{
	display_text_title.innerHTML=`${chrono_queue_here().m_display_name}`;
	//display_text_comment.innerHTML=`${}`;
}


function chrono_display_color(f_c1, f_c2)
{
	{//c2
		for (const v of display_texts_c2_back)
		{
			v.style["background-color"]=f_c2;
		}
	}
	
	{//c1
		for (const v of display_texts_c1_stroke)
		{
			v.style["stroke"]=f_c1;
		}
		for (const v of display_texts_c1_fill)
		{
			v.style["fill"]=f_c1;
		}
		for (const v of display_texts_c1_text)
		{
			v.style["color"]=f_c1;
		}
	}
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
				display_text_comment.innerHTML=String(parseInt((1-(timer_span_fresh_ms/timer_span_max))*100))+"%";//!

				//vars/all
				let here_arc_m="500 100";
				let here_arc_a="500 100";
				let here_arc_s;
				let here_arc_f;
				let here_fract=timer_span_fresh_ms/timer_span_max;

				if (queue_index<0)
				{//no queue
					here_fract=1;
				} else {
					here_arc_s=chrono_queue_here().m_display_fill;
					if (chrono_queue_here().m_display_wise)//counterclockwise
					{
						here_fract=1-here_fract;
						here_arc_s=!here_arc_s;
					}
				}

				//vars/points
				{
					let here_x=500+( Math.cos(Math.PI*2*here_fract-Math.PI/2) *400);
					let here_y=500+( Math.sin(Math.PI*2*here_fract-Math.PI/2) *400);
					here_arc_a=`${here_x} ${here_y}`;
				}
					
				here_arc_f=here_arc_s;
				if (here_fract<=1/2)
				{//change parth when half
					here_arc_s=!here_arc_s;
				}

				function here_display_bool(f_bool)
				{
					if (f_bool)
						return "1";
					else
						return "0";
				}

				display_vector_arc.setAttribute("d",`M ${here_arc_m} A 400 400 0 ${here_display_bool(here_arc_s)} ${here_display_bool(here_arc_f)} ${here_arc_a}`);

			}
		}
	}


	//change
	display_button_pause.style.margin="10px";
	if (timer_started)
	{
		display_button_start.style.display="none";
		if (timer_paused)
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


//--- functions/menu ---

function chrono_my_child(f_childs,f_query)
{
	for (let i=0;i < f_childs.length;i++)
	{
		if (f_childs[i].matches(f_query))
		{
			return f_childs[i];
		}
	}
	return;
}

function chrono_my_childs(f_childs,f_query)
{
	r_matcher=[]
	for (let i=0;i < f_childs.length;i++)
	{
		if (f_childs[i].matches(f_query))
		{
			r_matcher.push(f_childs[i]);
		}
	}
	return r_matcher;
}

function chrono_options_read_itm(f_doc_itm)
{
	//cat_add(`father class : ${f_doc_itm.getAttribute("class")}`);
	let here_child=chrono_my_child(f_doc_itm.children,".itm_name");
	//cat_add(`child value : ${here_child.value}`);

	let here_time_txt=chrono_my_child(f_doc_itm.children,".itm_time").value;
	//here_time_txt.trim(":");
	let here_time_int=Number(here_time_txt)*1000;

	let here_iter_txt=chrono_my_child(f_doc_itm.children,".itm_iter").value;
	let here_iter_int=Number(here_iter_txt);

	let here_name_txt=chrono_my_child(f_doc_itm.children,".itm_name").value;
	here_name_txt=here_name_txt.toUpperCase();


	return new Queue(
	here_time_int,
	here_iter_int,
	false,
	here_name_txt
	);
	//queue_elements.push(new Queue(4500,1,true,"EXERCICE",false,true,"#faa","#f00"));
}

function chrono_options_read_all()
{
	queue_elements=[];
	let here_fathers=chrono_my_childs(display_options_itms_grandfather.children,".itm.queueelement");
	for (let i=0;i < here_fathers.length;i++)
	{
		let here_queue=chrono_options_read_itm(here_fathers[i]);
		here_queue.m_display_c1="fffa";
		here_queue.m_display_c2="000f";
		queue_elements.push(here_queue);
		//queue_elements.push(new Queue(4500,1,true,"EXERCICE",false,true,"#faa","#f00"));
	}
	//console.log(queue_elements);
}


function chrono_options_write_itm(f_queue,f_index)
{
	let here_newitm=document.createElement("div");
	here_newitm.className="itm texter queueelement";

	{//delete button
		let here_child=document.createElement("input");
		here_child.type="button";
		here_child.className="itm_minus";

		here_child.value="-";

		here_child.onclick=function() {chrono_action_menu_queue_remove(f_index)};
		
		here_newitm.appendChild(here_child);
	}

	{//type iter
		let here_child=document.createElement("input");
		here_child.type="text";
		here_child.className="itm_iter";
		here_child.minLength="1";
		here_child.maxLength="2";
		here_child.size="2";

		here_child.value=f_queue.m_sett_loop;
		
		here_newitm.appendChild(here_child);
	}

	{//type time
		let here_child=document.createElement("input");
		here_child.type="text";
		here_child.className="itm_time";
		here_child.minLength="1";
		here_child.maxLength="6";
		//here_child.min="1";
		//here_child.max="3599999";
		here_child.size="6";

		here_child.value=f_queue.m_sett_time/1000;
		
		here_newitm.appendChild(here_child);
	}

	{//type name
		let here_child=document.createElement("input");
		here_child.type="text";
		here_child.className="itm_name";
		here_child.minLength="2";
		here_child.maxLength="10";
		here_child.size="10";

		here_child.value=f_queue.m_display_name;
		
		here_newitm.appendChild(here_child);
	}

	display_options_itms_grandfather.appendChild(here_newitm);
}

function chrono_options_write_all()
{
	//kill all ded childrens
	while(display_options_itms_grandfather.firstChild)
	{
		display_options_itms_grandfather.removeChild(display_options_itms_grandfather.lastChild);
	}

	//create a new generation
	for (let i=0;i < queue_elements.length;i++)
	{
		chrono_options_write_itm(queue_elements[i],i);
	}

	//the creator
	if (queue_elements.length<sett_menu_maxqueue) {
		let here_newitm=document.createElement("div");
		here_newitm.className="itm texter";

		{//create button
			let here_child=document.createElement("input");
			here_child.type="button";
			here_child.className="itm_iter";

			here_child.value="+";

			here_child.onclick=function() {chrono_action_menu_queue_add()};

			here_newitm.appendChild(here_child);
		}

		display_options_itms_grandfather.appendChild(here_newitm);
	}

	//console.log(queue_elements);
}



//--- functions/action ---

function chrono_action_play()
{
	if (timer_paused)
		chrono_clock_continue();
	else
		if (timer_started)
			chrono_clock_pause();
		else
			chrono_next();//start
}


function chrono_action_menu_switch()
{
	if (display_menu_actual===2)
		chrono_display_menu_switch(1);
	else
		chrono_display_menu_switch(2);
}

function chrono_action_menu_queue_add()
{
	queue_elements.push(new Queue(60000,1,true,"NEW"));
	chrono_options_write_all();
}

function chrono_action_menu_queue_remove(f_i)
{
	delete queue_elements.splice(f_i,1);
	chrono_options_write_all();
}



function chrono_action_press(f_event)
{
	let here_key=String(f_event.key);

	if (here_key===" ")
	{
		chrono_action_play();
	}
}

//function chrono_action_back3()
//{//go to the begin
//	chrono_clock_pause();
//}


//--- launcher ---

cat_add(`fonctions en ${Date.now() - span_loading_begin} ms`,"neg gray");

chrono_display_menu_switch(1);
chrono_display_timer_init();

//queue_elements.push(new Queue(4500,1,true,"123456789123456789123456789123456789123456789",false,true));

//raimbow
//queue_elements.push(new Queue(100,1,false,"a",false,true,"#fffa","#f00"));
//queue_elements.push(new Queue(100,1,false,"a",false,true,"#fffa","#ff0"));
//queue_elements.push(new Queue(100,1,false,"a",false,true,"#fffa","#0f0"));
//queue_elements.push(new Queue(100,1,false,"a",false,true,"#fffa","#0ff"));
//queue_elements.push(new Queue(100,1,false,"a",false,true,"#fffa","#00f"));
//queue_elements.push(new Queue(100,10,false,"a",false,true,"#fffa","#f0f"));

//sport
queue_elements.push(new Queue(4500,1,true,"EXERCICE",false,true,"#fffa","#f00"));
queue_elements.push(new Queue(1500,10,true,"REPOS",true,true,"#fffa","#fa0"));
queue_elements.push(new Queue(36000,2,true,"GRANDE PAUSE",true,true,"#fffa","#0a0"));

//queue_elements.push(new Queue(45000,1,true,"exercice",false,true));
//queue_elements.push(new Queue(15000,3,true,"repos",true,false));
//queue_elements.push(new Queue(360000,2,true,"grande pause",true,false));


cat_add("prêt !","neg magenta bold");