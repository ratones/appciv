var Config = {
	civ:{
		elements:[
			{id:'vin',style:{position:'absolute',top:10,left:100}},
			{id:'nr_registru',style:{position:'absolute',top:30,left:150}},
			{id:'motor',style:{position:'absolute',top:30,left:550}}
		],
		bindings:{
			'#nr_identif':'vin',
			'#nr_registru':'nr_registru'
		}
	}
};
module.exports = Config;