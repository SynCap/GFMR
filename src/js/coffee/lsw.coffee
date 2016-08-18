###*
# localStorage Wrapper
# 
# @param  {string} key Name of the key, if ommited return array of key names
# @param  {string} val Value to store. Value stored if key and value are present
# @return {vary}     1. if no parameters are given = array of key names
#                       2. if `key` is present only = vaulue for given key
#                       3. if `key` and `value` are present = length of storage
###

lsw = (key, val) ->
	# console.log('%s = %s', key, val);
	argc = arguments.length
	if argc == 0
		# без параметров - array с ключами
		len = localStorage.length
		res = []
		i = 0
		while i < len
			res[i] = localStorage.key(i)
			i++
		return res
	# один строковый параметр -> значение по ключу
	if typeof key == 'string' and argc == 1
		return localStorage.getItem(key)
	# 2 параметра и первый - строка, значит записываем, на выходе - количество записей
	if typeof key == 'string' and argc == 2
		localStorage.setItem key, val
		return localStorage.length
	return
