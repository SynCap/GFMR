/**
 * localStorage Wrapper
 * 
 * @param  {string} key	Name of the key, if ommited return array of key names
 * @param  {string} val	Value to store. Value stored if key and value are present
 * @return {vary}   	1. if no parameters are given = array of key names
 *                  	2. if `key` is present only = vaulue for given key
 *                  	3. if `key` and `value` are present = length of storage
 */	
function lsw ( key, val) {

	// console.log('%s = %s', key, val);

	var argc = arguments.length;

	if (argc === 0) {
		// без параметров - array с ключами
		var len = localStorage.length;
		var res = [];
		for (var i = 0; i<len; i++) {
			res[i] = localStorage.key(i);
		}
		return res;
	}

	if (typeof(key) === 'string' && argc === 1) {
		return localStorage.getItem(key);
	}

	if (typeof(key) === 'string' && argc === 2) {
		localStorage.setItem(key, val);
		return localStorage.length;
	}
}
