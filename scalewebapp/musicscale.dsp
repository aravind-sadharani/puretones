//   _____           _ _                           _   __  __           _       __          __        _        
//  / ____|         | | |                         (_) |  \/  |         (_)      \ \        / /       | |       
// | (___   __ _  __| | |__   __ _ _ __ __ _ _ __  _  | \  / |_   _ ___ _  ___   \ \  /\  / /__  _ __| | _____ 
//  \___ \ / _` |/ _` | '_ \ / _` | '__/ _` | '_ \| | | |\/| | | | / __| |/ __|   \ \/  \/ / _ \| '__| |/ / __|
//  ____) | (_| | (_| | | | | (_| | | | (_| | | | | | | |  | | |_| \__ \ | (__     \  /\  / (_) | |  |   <\__ \
// |_____/ \__,_|\__,_|_| |_|\__,_|_|  \__,_|_| |_|_| |_|  |_|\__,_|___/_|\___|     \/  \/ \___/|_|  |_|\_\___/
//
// PureTones Keys - Developed by Aravind Iyer and S Balachander, Sadharani Music Works
// A tunable keyboard to be used with puretones-drone.dsp or puretones-drone-six.dsp
//

import("stdfaust.lib");
coarseselector = vslider("[000][style:radio{'B':14;'A#':13;'A':12;'G#':11;'G':10;'F#':9;'F':8;'E':7;'D#':6;'D':5;'C#':4;'C':3}]Pitch",11,3,14,1);
coarse = 110*(2^(coarseselector/12));
octaveselector = vslider("[001][style:radio{'High':1;'Medium':0;'Low':-1;'Lowest':-2}]Octave",0,-2,1,1);
finecent = vslider("[002]Fine Tune",0,-100,100,1);
fineratio = 2^(finecent/1200);
commonfreq = coarse*fineratio*(2^octaveselector);
period = 2^(vslider("[003]Period",2,0,3,0.1));

note(freq,ratio,period) = string(freq,tunedratio)*rolloffenv
  with {
    n = 32;
  	g = 0.6;
    amplitude = 0.4*(1-g)/(1-g^(n+1));
    ToneStringModel(f) = ((g^(n+1))*os.osc(f*n) - (g^n)*os.osc(f*(n+1)) + os.osc(f))/((1-g)^2+4*g*os.osc(f/2)*os.osc(f/2)) : *(amplitude);
    variance = vslider("[000]Variance",2,0,10,0.1)/10000;
    string(f,r) = ToneStringModel(f*r*(1+variance)) + ToneStringModel(f*r*(1-variance));
  	c = checkbox("Play") : si.smoo;
    b = button("Pluck") ;
  	cent = vslider("[00]Cent", 0,-100,100,1);
  	ratio10 = 2^(cent/1200);
    pointOonecent = vslider("[01]0.01 Cent", 0,-100,100,1);
    ratio00 = 2^(pointOonecent/120000);
    shakeselector = checkbox("[02]Gamaka");
    delta1cent = vslider("[03]Starting Cent", 0,-220,220,1);  	
    delta1pointOonecent = vslider("[04]Starting 0.01 Cent", 0,-100,100,1);
    delta1 = (2^(delta1cent/1200))*(2^(delta1pointOonecent/120000))-1;
    delta2cent = vslider("[05]Ending Cent", 0,-220,220,1);  	
    delta2pointOonecent = vslider("[06]Ending 0.01 Cent", 0,-100,100,1);
    delta2 = (2^(delta2cent/1200))*(2^(delta2pointOonecent/120000))-1;
    rate = 2^(vslider("[07]Rate",17,-5,25,0.1)/10);
    number = vslider("[08]Number",3.5,0,10,0.01);
    phasor(f) = (+(f/ma.SR) ~ ma.decimal);
    cphasedcos(x) = phasor(x) - (phasor(x) : ba.latch(gate(period))) : *(2*ma.PI) : cos;
	  bphasedcos(x) = phasor(x) - (phasor(x) : ba.latch(b)) : *(2*ma.PI) : cos;
    ramp(x) = +(x/ma.SR) ~ _;
	  clockedramp(x) = ramp(x) - (ramp(x) : ba.latch(gate(period)));
    blockedramp(x) = ramp(x) - (ramp(x) : ba.latch(b));
    shake(d1,d2,r,n,p) = shakeselector*c*(1+((d1+d2)/2+(d1-d2)*cphasedcos(r)/2)*(clockedramp(r) < n)) + shakeselector*(1-c)*(1+((d1+d2)/2+(d1-d2)*bphasedcos(r)/2)*(blockedramp(r) < n))+ (1-shakeselector);
    gate(p) = os.lf_pulsetrainpos(1/p,0.3);
    env(p) = 4*en.adsr(0.0001,p-1,0.5,p-1,gate(p));
    benv = 3.5*en.adsr(0.0001,1,0.8,1,b);
    pluck = (period) : env;
  	tunedratio = ratio*ratio10*ratio00*(delta1,delta2,rate,number,period : shake);
    rolloffenv = en.adsr(0.001,period*0.6,0.8,period*0.5,c*gate(period)) + en.adsr(0.0001,0.2,0.8,0.1,b);
};

scale(c,e) = tgroup("[05]12 Note Scale", string01+string02+string03+string04+string05+string06+string07+string08+string09+string10+string11+string12+string13)
  with {
  	string01 = hgroup("[01] Sa ", (c,1,e : note));
    string02 = hgroup("[02] re ", (c,256/243,e : note));
    string03 = hgroup("[03] Re ", (c,9/8,e : note));
    string04 = hgroup("[04] ga ", (c,32/27,e : note));
    string05 = hgroup("[05] Ga ", (c,81/64,e : note)); 
    string06 = hgroup("[06] ma ", (c,4/3,e : note));
    string07 = hgroup("[07] Ma ", (c,729/512,e : note));
    string08 = hgroup("[08] Pa ", (c,3/2,e : note));
    string09 = hgroup("[09] dha ", (c,128/81,e : note));  
    string10 = hgroup("[10] Dha ", (c,27/16,e : note));
    string11 = hgroup("[11] ni ", (c,16/9,e : note));
    string12 = hgroup("[12] Ni ", (c,243/128,e : note));
    string13 = hgroup("[13] SA ", (c,2,e : note));  
};

process = hgroup("[0000]Common Parameters",(commonfreq,period) : scale) <: dm.zita_light;
