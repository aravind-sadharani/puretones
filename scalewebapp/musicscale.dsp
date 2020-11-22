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
coarseselector = 2 + nentry("[000]Pitch (C=1, C#=2, ...)",9,1,12,1);
coarse = 110*(2^(coarseselector/12));
octaveselector = nentry("[001][style:radio{'High':1;'Medium':0;'Low':-1}]Octave",0,-1,1,1);
finecent = vslider("[002]Fine Tune",0,-100,100,1);
fineratio = 2^(finecent/1200);
commonfreq = coarse*fineratio*(2^octaveselector);
period = 2^(vslider("[003]Period",2,0,3,0.1));
attack = 10^(-4);
hold = 0.6;
decay = 0.8;
release = 0.5;
gate(p) = os.lf_pulsetrainpos(1/p,0.3);
env = en.adsr(attack,period*hold,decay,period*release,gate(period));

note(freq,ratio,period) = c*string(freq,tunedratio,pluck)
  with {
    openStringPick(length,stiffness,pluckPosition,excitation) = strChain
	  with{
	    dispersionFilters = par(i,2,si.smooth(stiffness)),_;
      maxStringLength = 6;
      nti = length*pluckPosition; // length of the upper portion of the string
	    itb = length*(1-pluckPosition); // length of the lower portion of the string
      strChain = pm.chain(
        pm.stringSegment(maxStringLength,nti) : 
        pm.in(excitation) : 
        pm.out : 
        dispersionFilters : 
        pm.stringSegment(maxStringLength,itb)
      );
	  };
    StringModel(length,pluckPosition,excitation,brightness,damping,stiffness) = 0.05*pm.endChain(egChain)
    with{
      lengthTuning = 14*pm.speedOfSound/ma.SR;
      stringL = length-lengthTuning;
      egChain = pm.chain(
        pm.lStringRigidTermination :
        openStringPick(stringL,stiffness/1000,pluckPosition,excitation) :
        pm.rTermination(pm.basicBlock,(-1)*pm.bridgeFilter(brightness,damping))
      );
    };
    variance = 2/10000;
    string(f,r,p) = StringModel(pm.f2l(f*r*(1+variance)),0.63,1*p,min(0.95,0.5*(r^0.75)),0,60/(r^2)) + StringModel(pm.f2l(f*r*(1-variance)),0.63,1*p,min(0.95,0.5*(r^0.75)),0,60/(r^2));
  	c = (vslider("[00]Play",0,0,1,1) == 1);
  	cent = vslider("[01]Cent", 0,-100,100,1);
  	ratio10 = 2^(cent/1200);
    pointOonecent = vslider("[02]0.01 Cent", 0,-100,100,1);
    ratio00 = 2^(pointOonecent/120000);
    shakeselector = (vslider("[03]Gamaka",0,0,1,1) == 1);
    delta1cent = vslider("[04]Starting Cent", 0,-220,220,1);  	
    delta1pointOonecent = vslider("[05]Starting 0.01 Cent", 0,-100,100,1);
    delta1 = (2^(delta1cent/1200))*(2^(delta1pointOonecent/120000))-1;
    delta2cent = vslider("[06]Ending Cent", 0,-220,220,1);  	
    delta2pointOonecent = vslider("[07]Ending 0.01 Cent", 0,-100,100,1);
    delta2 = (2^(delta2cent/1200))*(2^(delta2pointOonecent/120000))-1;
    rate = 2^(vslider("[08]Gamaka Rate",17,-5,25,0.1)/10);
    number = vslider("[09]Gamaka Number",3.5,0,10,0.01);
    phasor(f) = (+(f/ma.SR) ~ ma.decimal);
    latchedphasor(f) = phasor(f) - (phasor(f) : ba.latch(gate(period)));
    phasedcos(x) = latchedphasor(x) : *(2*ma.PI) : cos;
    shake(d1,d2,r,n,p) = shakeselector*(1+((d1+d2)/2+(d1-d2)*phasedcos(r)/2)*(latchedphasor(1/p) < n/(p*r))) + (1-shakeselector);
    gate(p) = os.lf_pulsetrainpos(1/p,0.3);
    env(p) = 4*en.adsr(0.001,p-1,0.5,p-1,gate(p));
    pluck = (period) : env;
  	tunedratio = ratio*ratio10*ratio00*(delta1,delta2,rate,number,period : shake);
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

process = hgroup("[0000]Common Parameters",((commonfreq,period) : scale) : *(env)) <: dm.zita_light;
