
/*
Code generated with Faust version 2.20.2
Compilation options: -lang wasm -scal -ftz 2
*/

function getJSONpuretones() {
	return '{"name": "puretones","filename": "puretones.dsp","version": "2.20.2","compile_options": "-lang wasm -scal -ftz 2","library_list": ["/usr/share/faust/stdfaust.lib","/usr/share/faust/demos.lib","/usr/share/faust/reverbs.lib","/usr/share/faust/maths.lib","/usr/share/faust/delays.lib","/usr/share/faust/basics.lib","/usr/share/faust/signals.lib","/usr/share/faust/filters.lib","/usr/share/faust/routes.lib","/usr/share/faust/oscillators.lib","/usr/share/faust/envelopes.lib"],"include_pathnames": ["/usr/share/faust","/usr/local/share/faust","/usr/share/faust",".","/home/aravind/Web/webpuretones"],"size": 27700360,"inputs": 0,"outputs": 2,"meta": [ { "basics.lib/name": "Faust Basic Element Library" },{ "basics.lib/version": "0.1" },{ "delays.lib/name": "Faust Delay Library" },{ "delays.lib/version": "0.1" },{ "envelopes.lib/adsr:author": "Yann Orlarey" },{ "envelopes.lib/author": "GRAME" },{ "envelopes.lib/copyright": "GRAME" },{ "envelopes.lib/license": "LGPL with exception" },{ "envelopes.lib/name": "Faust Envelope Library" },{ "envelopes.lib/version": "0.0" },{ "filename": "puretones.dsp" },{ "filters.lib/allpass_comb:author": "Julius O. Smith III" },{ "filters.lib/allpass_comb:copyright": "Copyright (C) 2003-2019 by Julius O. Smith III <jos@ccrma.stanford.edu>" },{ "filters.lib/allpass_comb:license": "MIT-style STK-4.3 license" },{ "filters.lib/fir:author": "Julius O. Smith III" },{ "filters.lib/fir:copyright": "Copyright (C) 2003-2019 by Julius O. Smith III <jos@ccrma.stanford.edu>" },{ "filters.lib/fir:license": "MIT-style STK-4.3 license" },{ "filters.lib/iir:author": "Julius O. Smith III" },{ "filters.lib/iir:copyright": "Copyright (C) 2003-2019 by Julius O. Smith III <jos@ccrma.stanford.edu>" },{ "filters.lib/iir:license": "MIT-style STK-4.3 license" },{ "filters.lib/lowpass0_highpass1": "Copyright (C) 2003-2019 by Julius O. Smith III <jos@ccrma.stanford.edu>" },{ "filters.lib/lowpass0_highpass1:author": "Julius O. Smith III" },{ "filters.lib/lowpass:author": "Julius O. Smith III" },{ "filters.lib/lowpass:copyright": "Copyright (C) 2003-2019 by Julius O. Smith III <jos@ccrma.stanford.edu>" },{ "filters.lib/lowpass:license": "MIT-style STK-4.3 license" },{ "filters.lib/name": "Faust Filters Library" },{ "filters.lib/peak_eq_rm:author": "Julius O. Smith III" },{ "filters.lib/peak_eq_rm:copyright": "Copyright (C) 2003-2019 by Julius O. Smith III <jos@ccrma.stanford.edu>" },{ "filters.lib/peak_eq_rm:license": "MIT-style STK-4.3 license" },{ "filters.lib/tf1:author": "Julius O. Smith III" },{ "filters.lib/tf1:copyright": "Copyright (C) 2003-2019 by Julius O. Smith III <jos@ccrma.stanford.edu>" },{ "filters.lib/tf1:license": "MIT-style STK-4.3 license" },{ "filters.lib/tf1s:author": "Julius O. Smith III" },{ "filters.lib/tf1s:copyright": "Copyright (C) 2003-2019 by Julius O. Smith III <jos@ccrma.stanford.edu>" },{ "filters.lib/tf1s:license": "MIT-style STK-4.3 license" },{ "filters.lib/tf2:author": "Julius O. Smith III" },{ "filters.lib/tf2:copyright": "Copyright (C) 2003-2019 by Julius O. Smith III <jos@ccrma.stanford.edu>" },{ "filters.lib/tf2:license": "MIT-style STK-4.3 license" },{ "maths.lib/author": "GRAME" },{ "maths.lib/copyright": "GRAME" },{ "maths.lib/license": "LGPL with exception" },{ "maths.lib/name": "Faust Math Library" },{ "maths.lib/version": "2.1" },{ "name": "puretones" },{ "oscillators.lib/name": "Faust Oscillator Library" },{ "oscillators.lib/version": "0.0" },{ "reverbs.lib/name": "Faust Reverb Library" },{ "reverbs.lib/version": "0.0" },{ "routes.lib/name": "Faust Signal Routing Library" },{ "routes.lib/version": "0.1" },{ "signals.lib/name": "Faust Signal Routing Library" },{ "signals.lib/version": "0.0" }],"ui": [ {"type": "vgroup","label": "puretones","items": [ {"type": "hgroup","label": "Zita Light","items": [ {"type": "vslider","label": "Dry/Wet Mix","address": "/puretones/Zita_Light/Dry/Wet_Mix","index": 524300,"meta": [{ "1": "" },{ "style": "knob" },{ "tooltip": "-1 = dry, 1 = wet" }],"init": 0,"min": -1,"max": 1,"step": 0.01},{"type": "vslider","label": "Level","address": "/puretones/Zita_Light/Level","index": 524288,"meta": [{ "2": "" },{ "style": "knob" },{ "tooltip": "Output scale   factor" },{ "unit": "dB" }],"init": -6,"min": -70,"max": 40,"step": 0.1}]},{"type": "hgroup","label": "PureTones v1.0","meta": [{ "00": "" }],"items": [ {"type": "hgroup","label": "0x00","meta": [{ "0": "" }],"items": [ {"type": "vslider","label": "Common Frequency","address": "/puretones/PureTones_v1.0/0x00/Common_Frequency","index": 524336,"meta": [{ "0": "" },{ "style": "radio{\'B\':14;\'A#\':13;\'A\':12;\'G#\':11;\'G\':10;\'F#\':9;\'F\':8;\'E\':7;\'D#\':6;\'D\':5;\'C#\':4;\'C\':3}" }],"init": 11,"min": 3,"max": 14,"step": 1},{"type": "vslider","label": "Octave Selector","address": "/puretones/PureTones_v1.0/0x00/Octave_Selector","index": 524332,"meta": [{ "1": "" },{ "style": "radio{\'High\':1;\'Medium\':0;\'Low\':-1}" }],"init": 0,"min": -1,"max": 1,"step": 1},{"type": "vslider","label": "Fine Tune","address": "/puretones/PureTones_v1.0/0x00/Fine_Tune","index": 524340,"meta": [{ "2": "" }],"init": 0,"min": -100,"max": 100,"step": 1},{"type": "vslider","label": "Period","address": "/puretones/PureTones_v1.0/0x00/Period","index": 524448,"meta": [{ "3": "" }],"init": 7,"min": 4,"max": 10,"step": 0.5}]},{"type": "tgroup","label": "0x00","meta": [{ "1": "" }],"items": [ {"type": "hgroup","label": "1st String","meta": [{ "1": "" }],"items": [ {"type": "vslider","label": "Select Note","address": "/puretones/PureTones_v1.0/0x00/1st_String/Select_Note","index": 524352,"meta": [{ "001": "" },{ "style": "radio{\'SA\':0;\'Ni^\':1;\'Ni_\':2;\'Dha^\':3;\'Dha_\':4;\'Pa\':5;\'Ma^\':6;\'Ma_\':7;\'Ga^\':8;\'Ga_\':9;\'Re^\':10;\'Re_\':11;\'Sa\':12}" }],"init": 5,"min": 0,"max": 12,"step": 1},{"type": "vgroup","label": "Play String","meta": [{ "00": "" }],"items": [ {"type": "button","label": "Once","address": "/puretones/PureTones_v1.0/0x00/1st_String/Play_String/Once","index": 524452,"meta": [{ "0": "" }]},{"type": "checkbox","label": "Loop","address": "/puretones/PureTones_v1.0/0x00/1st_String/Play_String/Loop","index": 524456,"meta": [{ "1": "" }]}]},{"type": "vslider","label": "Fine Tune","address": "/puretones/PureTones_v1.0/0x00/1st_String/Fine_Tune","index": 524344,"meta": [{ "02": "" }],"init": 0,"min": -100,"max": 100,"step": 1},{"type": "vslider","label": "Ultrafine Tune","address": "/puretones/PureTones_v1.0/0x00/1st_String/Ultrafine_Tune","index": 524348,"meta": [{ "03": "" }],"init": 0,"min": -100,"max": 100,"step": 1},{"type": "vslider","label": "Variance","address": "/puretones/PureTones_v1.0/0x00/1st_String/Variance","index": 524356,"meta": [{ "04": "" }],"init": 5,"min": 0,"max": 20,"step": 0.1},{"type": "vslider","label": "Gain","address": "/puretones/PureTones_v1.0/0x00/1st_String/Gain","index": 524312,"meta": [{ "08": "" }],"init": 0,"min": -20,"max": 20,"step": 0.1},{"type": "vslider","label": "Octave 1","address": "/puretones/PureTones_v1.0/0x00/1st_String/Octave_1","index": 524724,"meta": [{ "11": "" }],"init": 5.6,"min": 0,"max": 10,"step": 0.1},{"type": "vslider","label": "Octave 2","address": "/puretones/PureTones_v1.0/0x00/1st_String/Octave_2","index": 524740,"meta": [{ "11": "" }],"init": 7.8,"min": 0,"max": 10,"step": 0.1},{"type": "vslider","label": "Octave 3","address": "/puretones/PureTones_v1.0/0x00/1st_String/Octave_3","index": 524548,"meta": [{ "12": "" }],"init": 5.6,"min": 0,"max": 10,"step": 0.1},{"type": "vslider","label": "Octave 4","address": "/puretones/PureTones_v1.0/0x00/1st_String/Octave_4","index": 524508,"meta": [{ "13": "" }],"init": 1,"min": 0,"max": 10,"step": 0.1},{"type": "vslider","label": "Octave 5","address": "/puretones/PureTones_v1.0/0x00/1st_String/Octave_5","index": 524404,"meta": [{ "14": "" }],"init": 0.4,"min": 0,"max": 10,"step": 0.1},{"type": "vslider","label": "Octave 6","address": "/puretones/PureTones_v1.0/0x00/1st_String/Octave_6","index": 524316,"meta": [{ "15": "" }],"init": 0.2,"min": 0,"max": 10,"step": 0.1}]},{"type": "hgroup","label": "2nd String","meta": [{ "2": "" }],"items": [ {"type": "vslider","label": "Select Note","address": "/puretones/PureTones_v1.0/0x00/2nd_String/Select_Note","index": 524820,"meta": [{ "001": "" },{ "style": "radio{\'SA\':0;\'Ni^\':1;\'Ni_\':2;\'Dha^\':3;\'Dha_\':4;\'Pa\':5;\'Ma^\':6;\'Ma_\':7;\'Ga^\':8;\'Ga_\':9;\'Re^\':10;\'Re_\':11;\'Sa\':12}" }],"init": 0,"min": 0,"max": 12,"step": 1},{"type": "vgroup","label": "Play String","meta": [{ "00": "" }],"items": [ {"type": "button","label": "Once","address": "/puretones/PureTones_v1.0/0x00/2nd_String/Play_String/Once","index": 524888,"meta": [{ "0": "" }]},{"type": "checkbox","label": "Loop","address": "/puretones/PureTones_v1.0/0x00/2nd_String/Play_String/Loop","index": 524892,"meta": [{ "1": "" }]}]},{"type": "vslider","label": "Fine Tune","address": "/puretones/PureTones_v1.0/0x00/2nd_String/Fine_Tune","index": 524812,"meta": [{ "02": "" }],"init": 0,"min": -100,"max": 100,"step": 1},{"type": "vslider","label": "Ultrafine Tune","address": "/puretones/PureTones_v1.0/0x00/2nd_String/Ultrafine_Tune","index": 524816,"meta": [{ "03": "" }],"init": 0,"min": -100,"max": 100,"step": 1},{"type": "vslider","label": "Variance","address": "/puretones/PureTones_v1.0/0x00/2nd_String/Variance","index": 524824,"meta": [{ "04": "" }],"init": 5,"min": 0,"max": 20,"step": 0.1},{"type": "vslider","label": "Gain","address": "/puretones/PureTones_v1.0/0x00/2nd_String/Gain","index": 524804,"meta": [{ "08": "" }],"init": 0,"min": -20,"max": 20,"step": 0.1},{"type": "vslider","label": "Octave 1","address": "/puretones/PureTones_v1.0/0x00/2nd_String/Octave_1","index": 4719404,"meta": [{ "11": "" }],"init": 5.6,"min": 0,"max": 10,"step": 0.1},{"type": "vslider","label": "Octave 2","address": "/puretones/PureTones_v1.0/0x00/2nd_String/Octave_2","index": 4719416,"meta": [{ "11": "" }],"init": 7.8,"min": 0,"max": 10,"step": 0.1},{"type": "vslider","label": "Octave 3","address": "/puretones/PureTones_v1.0/0x00/2nd_String/Octave_3","index": 4719256,"meta": [{ "12": "" }],"init": 5.6,"min": 0,"max": 10,"step": 0.1},{"type": "vslider","label": "Octave 4","address": "/puretones/PureTones_v1.0/0x00/2nd_String/Octave_4","index": 4719228,"meta": [{ "13": "" }],"init": 1,"min": 0,"max": 10,"step": 0.1},{"type": "vslider","label": "Octave 5","address": "/puretones/PureTones_v1.0/0x00/2nd_String/Octave_5","index": 524860,"meta": [{ "14": "" }],"init": 0.4,"min": 0,"max": 10,"step": 0.1},{"type": "vslider","label": "Octave 6","address": "/puretones/PureTones_v1.0/0x00/2nd_String/Octave_6","index": 524808,"meta": [{ "15": "" }],"init": 0.2,"min": 0,"max": 10,"step": 0.1}]},{"type": "hgroup","label": "3rd String","meta": [{ "3": "" }],"items": [ {"type": "vslider","label": "Select Note","address": "/puretones/PureTones_v1.0/0x00/3rd_String/Select_Note","index": 4719492,"meta": [{ "001": "" },{ "style": "radio{\'SA\':0;\'Ni^\':1;\'Ni_\':2;\'Dha^\':3;\'Dha_\':4;\'Pa\':5;\'Ma^\':6;\'Ma_\':7;\'Ga^\':8;\'Ga_\':9;\'Re^\':10;\'Re_\':11;\'Sa\':12}" }],"init": 12,"min": 0,"max": 12,"step": 1},{"type": "vgroup","label": "Play String","meta": [{ "00": "" }],"items": [ {"type": "button","label": "Once","address": "/puretones/PureTones_v1.0/0x00/3rd_String/Play_String/Once","index": 4719560,"meta": [{ "0": "" }]},{"type": "checkbox","label": "Loop","address": "/puretones/PureTones_v1.0/0x00/3rd_String/Play_String/Loop","index": 4719564,"meta": [{ "1": "" }]}]},{"type": "vslider","label": "Fine Tune","address": "/puretones/PureTones_v1.0/0x00/3rd_String/Fine_Tune","index": 4719484,"meta": [{ "02": "" }],"init": 0,"min": -100,"max": 100,"step": 1},{"type": "vslider","label": "Ultrafine Tune","address": "/puretones/PureTones_v1.0/0x00/3rd_String/Ultrafine_Tune","index": 4719488,"meta": [{ "03": "" }],"init": 0,"min": -100,"max": 100,"step": 1},{"type": "vslider","label": "Variance","address": "/puretones/PureTones_v1.0/0x00/3rd_String/Variance","index": 4719496,"meta": [{ "04": "" }],"init": 5,"min": 0,"max": 20,"step": 0.1},{"type": "vslider","label": "Gain","address": "/puretones/PureTones_v1.0/0x00/3rd_String/Gain","index": 4719476,"meta": [{ "08": "" }],"init": 0,"min": -20,"max": 20,"step": 0.1},{"type": "vslider","label": "Octave 1","address": "/puretones/PureTones_v1.0/0x00/3rd_String/Octave_1","index": 13108380,"meta": [{ "11": "" }],"init": 5.6,"min": 0,"max": 10,"step": 0.1},{"type": "vslider","label": "Octave 2","address": "/puretones/PureTones_v1.0/0x00/3rd_String/Octave_2","index": 13108392,"meta": [{ "11": "" }],"init": 7.8,"min": 0,"max": 10,"step": 0.1},{"type": "vslider","label": "Octave 3","address": "/puretones/PureTones_v1.0/0x00/3rd_String/Octave_3","index": 13108232,"meta": [{ "12": "" }],"init": 5.6,"min": 0,"max": 10,"step": 0.1},{"type": "vslider","label": "Octave 4","address": "/puretones/PureTones_v1.0/0x00/3rd_String/Octave_4","index": 13108204,"meta": [{ "13": "" }],"init": 1,"min": 0,"max": 10,"step": 0.1},{"type": "vslider","label": "Octave 5","address": "/puretones/PureTones_v1.0/0x00/3rd_String/Octave_5","index": 4719532,"meta": [{ "14": "" }],"init": 0.4,"min": 0,"max": 10,"step": 0.1},{"type": "vslider","label": "Octave 6","address": "/puretones/PureTones_v1.0/0x00/3rd_String/Octave_6","index": 4719480,"meta": [{ "15": "" }],"init": 0.2,"min": 0,"max": 10,"step": 0.1}]},{"type": "hgroup","label": "4th String","meta": [{ "4": "" }],"items": [ {"type": "vslider","label": "Select Note","address": "/puretones/PureTones_v1.0/0x00/4th_String/Select_Note","index": 13305176,"meta": [{ "001": "" },{ "style": "radio{\'SA\':0;\'Ni^\':1;\'Ni_\':2;\'Dha^\':3;\'Dha_\':4;\'Pa\':5;\'Ma^\':6;\'Ma_\':7;\'Ga^\':8;\'Ga_\':9;\'Re^\':10;\'Re_\':11;\'Sa\':12}" }],"init": 5,"min": 0,"max": 12,"step": 1},{"type": "vgroup","label": "Play String","meta": [{ "00": "" }],"items": [ {"type": "button","label": "Once","address": "/puretones/PureTones_v1.0/0x00/4th_String/Play_String/Once","index": 13305244,"meta": [{ "0": "" }]},{"type": "checkbox","label": "Loop","address": "/puretones/PureTones_v1.0/0x00/4th_String/Play_String/Loop","index": 13305248,"meta": [{ "1": "" }]}]},{"type": "vslider","label": "Fine Tune","address": "/puretones/PureTones_v1.0/0x00/4th_String/Fine_Tune","index": 13305168,"meta": [{ "02": "" }],"init": 0,"min": -100,"max": 100,"step": 1},{"type": "vslider","label": "Ultrafine Tune","address": "/puretones/PureTones_v1.0/0x00/4th_String/Ultrafine_Tune","index": 13305172,"meta": [{ "03": "" }],"init": 0,"min": -100,"max": 100,"step": 1},{"type": "vslider","label": "Variance","address": "/puretones/PureTones_v1.0/0x00/4th_String/Variance","index": 13305180,"meta": [{ "04": "" }],"init": 5,"min": 0,"max": 20,"step": 0.1},{"type": "vslider","label": "Gain","address": "/puretones/PureTones_v1.0/0x00/4th_String/Gain","index": 13305160,"meta": [{ "08": "" }],"init": 0,"min": -20,"max": 20,"step": 0.1},{"type": "vslider","label": "Octave 1","address": "/puretones/PureTones_v1.0/0x00/4th_String/Octave_1","index": 17499772,"meta": [{ "11": "" }],"init": 5.6,"min": 0,"max": 10,"step": 0.1},{"type": "vslider","label": "Octave 2","address": "/puretones/PureTones_v1.0/0x00/4th_String/Octave_2","index": 17499784,"meta": [{ "11": "" }],"init": 7.8,"min": 0,"max": 10,"step": 0.1},{"type": "vslider","label": "Octave 3","address": "/puretones/PureTones_v1.0/0x00/4th_String/Octave_3","index": 17499624,"meta": [{ "12": "" }],"init": 5.6,"min": 0,"max": 10,"step": 0.1},{"type": "vslider","label": "Octave 4","address": "/puretones/PureTones_v1.0/0x00/4th_String/Octave_4","index": 17499596,"meta": [{ "13": "" }],"init": 1,"min": 0,"max": 10,"step": 0.1},{"type": "vslider","label": "Octave 5","address": "/puretones/PureTones_v1.0/0x00/4th_String/Octave_5","index": 13305216,"meta": [{ "14": "" }],"init": 0.4,"min": 0,"max": 10,"step": 0.1},{"type": "vslider","label": "Octave 6","address": "/puretones/PureTones_v1.0/0x00/4th_String/Octave_6","index": 13305164,"meta": [{ "15": "" }],"init": 0.2,"min": 0,"max": 10,"step": 0.1}]},{"type": "hgroup","label": "5th String","meta": [{ "5": "" }],"items": [ {"type": "vslider","label": "Select Note","address": "/puretones/PureTones_v1.0/0x00/5th_String/Select_Note","index": 17499860,"meta": [{ "001": "" },{ "style": "radio{\'SA\':0;\'Ni^\':1;\'Ni_\':2;\'Dha^\':3;\'Dha_\':4;\'Pa\':5;\'Ma^\':6;\'Ma_\':7;\'Ga^\':8;\'Ga_\':9;\'Re^\':10;\'Re_\':11;\'Sa\':12}" }],"init": 0,"min": 0,"max": 12,"step": 1},{"type": "vgroup","label": "Play String","meta": [{ "00": "" }],"items": [ {"type": "button","label": "Once","address": "/puretones/PureTones_v1.0/0x00/5th_String/Play_String/Once","index": 17499928,"meta": [{ "0": "" }]},{"type": "checkbox","label": "Loop","address": "/puretones/PureTones_v1.0/0x00/5th_String/Play_String/Loop","index": 17499932,"meta": [{ "1": "" }]}]},{"type": "vslider","label": "Fine Tune","address": "/puretones/PureTones_v1.0/0x00/5th_String/Fine_Tune","index": 17499852,"meta": [{ "02": "" }],"init": 0,"min": -100,"max": 100,"step": 1},{"type": "vslider","label": "Ultrafine Tune","address": "/puretones/PureTones_v1.0/0x00/5th_String/Ultrafine_Tune","index": 17499856,"meta": [{ "03": "" }],"init": 0,"min": -100,"max": 100,"step": 1},{"type": "vslider","label": "Variance","address": "/puretones/PureTones_v1.0/0x00/5th_String/Variance","index": 17499864,"meta": [{ "04": "" }],"init": 5,"min": 0,"max": 20,"step": 0.1},{"type": "vslider","label": "Gain","address": "/puretones/PureTones_v1.0/0x00/5th_String/Gain","index": 17499844,"meta": [{ "08": "" }],"init": 0,"min": -20,"max": 20,"step": 0.1},{"type": "vslider","label": "Octave 1","address": "/puretones/PureTones_v1.0/0x00/5th_String/Octave_1","index": 25888748,"meta": [{ "11": "" }],"init": 5.6,"min": 0,"max": 10,"step": 0.1},{"type": "vslider","label": "Octave 2","address": "/puretones/PureTones_v1.0/0x00/5th_String/Octave_2","index": 25888760,"meta": [{ "11": "" }],"init": 7.8,"min": 0,"max": 10,"step": 0.1},{"type": "vslider","label": "Octave 3","address": "/puretones/PureTones_v1.0/0x00/5th_String/Octave_3","index": 25888600,"meta": [{ "12": "" }],"init": 5.6,"min": 0,"max": 10,"step": 0.1},{"type": "vslider","label": "Octave 4","address": "/puretones/PureTones_v1.0/0x00/5th_String/Octave_4","index": 25888572,"meta": [{ "13": "" }],"init": 1,"min": 0,"max": 10,"step": 0.1},{"type": "vslider","label": "Octave 5","address": "/puretones/PureTones_v1.0/0x00/5th_String/Octave_5","index": 17499900,"meta": [{ "14": "" }],"init": 0.4,"min": 0,"max": 10,"step": 0.1},{"type": "vslider","label": "Octave 6","address": "/puretones/PureTones_v1.0/0x00/5th_String/Octave_6","index": 17499848,"meta": [{ "15": "" }],"init": 0.2,"min": 0,"max": 10,"step": 0.1}]},{"type": "hgroup","label": "6th String","meta": [{ "6": "" }],"items": [ {"type": "vslider","label": "Select Note","address": "/puretones/PureTones_v1.0/0x00/6th_String/Select_Note","index": 25888836,"meta": [{ "001": "" },{ "style": "radio{\'SA\':0;\'Ni^\':1;\'Ni_\':2;\'Dha^\':3;\'Dha_\':4;\'Pa\':5;\'Ma^\':6;\'Ma_\':7;\'Ga^\':8;\'Ga_\':9;\'Re^\':10;\'Re_\':11;\'Sa\':12}" }],"init": 12,"min": 0,"max": 12,"step": 1},{"type": "vgroup","label": "Play String","meta": [{ "00": "" }],"items": [ {"type": "button","label": "Once","address": "/puretones/PureTones_v1.0/0x00/6th_String/Play_String/Once","index": 25888904,"meta": [{ "0": "" }]},{"type": "checkbox","label": "Loop","address": "/puretones/PureTones_v1.0/0x00/6th_String/Play_String/Loop","index": 25888908,"meta": [{ "1": "" }]}]},{"type": "vslider","label": "Fine Tune","address": "/puretones/PureTones_v1.0/0x00/6th_String/Fine_Tune","index": 25888828,"meta": [{ "02": "" }],"init": 0,"min": -100,"max": 100,"step": 1},{"type": "vslider","label": "Ultrafine Tune","address": "/puretones/PureTones_v1.0/0x00/6th_String/Ultrafine_Tune","index": 25888832,"meta": [{ "03": "" }],"init": 0,"min": -100,"max": 100,"step": 1},{"type": "vslider","label": "Variance","address": "/puretones/PureTones_v1.0/0x00/6th_String/Variance","index": 25888840,"meta": [{ "04": "" }],"init": 5,"min": 0,"max": 20,"step": 0.1},{"type": "vslider","label": "Gain","address": "/puretones/PureTones_v1.0/0x00/6th_String/Gain","index": 25888820,"meta": [{ "08": "" }],"init": 0,"min": -20,"max": 20,"step": 0.1},{"type": "vslider","label": "Octave 1","address": "/puretones/PureTones_v1.0/0x00/6th_String/Octave_1","index": 26937688,"meta": [{ "11": "" }],"init": 5.6,"min": 0,"max": 10,"step": 0.1},{"type": "vslider","label": "Octave 2","address": "/puretones/PureTones_v1.0/0x00/6th_String/Octave_2","index": 26937700,"meta": [{ "11": "" }],"init": 7.8,"min": 0,"max": 10,"step": 0.1},{"type": "vslider","label": "Octave 3","address": "/puretones/PureTones_v1.0/0x00/6th_String/Octave_3","index": 26937540,"meta": [{ "12": "" }],"init": 5.6,"min": 0,"max": 10,"step": 0.1},{"type": "vslider","label": "Octave 4","address": "/puretones/PureTones_v1.0/0x00/6th_String/Octave_4","index": 26937512,"meta": [{ "13": "" }],"init": 1,"min": 0,"max": 10,"step": 0.1},{"type": "vslider","label": "Octave 5","address": "/puretones/PureTones_v1.0/0x00/6th_String/Octave_5","index": 25888876,"meta": [{ "14": "" }],"init": 0.4,"min": 0,"max": 10,"step": 0.1},{"type": "vslider","label": "Octave 6","address": "/puretones/PureTones_v1.0/0x00/6th_String/Octave_6","index": 25888824,"meta": [{ "15": "" }],"init": 0.2,"min": 0,"max": 10,"step": 0.1}]}]}]}]}]}';
}

const dspName = "puretones";
const instance = new FaustWasm2ScriptProcessor(dspName);

// output to window or npm package module
if (typeof module === "undefined") {
    window[dspName] = instance;
} else {
    const exp = {};
    exp[dspName] = instance;
    module.exports = exp;
}

// Usage : puretones.createDSP(audioCtx, 1024).then(dsp => dsp.connect(audioCtx.destination));