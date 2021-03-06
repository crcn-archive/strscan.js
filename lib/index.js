
module.exports = function(source, options) {

	if(!options) {
		options = {
			skipWhitespace: true
		}
	}


	var _cchar = "",
	_ccode     = 0,
	_pos       = 0,
	_len       = 0,
	_src       = source;


	var self = {

		/**
		 * sets the source
		 */

		source: function(value) {
			_src = value;
			_len = value.length;
			self.pos(0);
		},
		
		/**
		 */

		skipWhitespace: function(value) {
			if(!arguments.length) {
				return options.skipWhitespace;
			}
			options.skipWhitespace = value;
		},

		/**
		 * true if the scanner cannot continue
		 */


		eof: function() {
			return _pos >= _len;
		},

		/**
		 */

		pos: function(value) {
			if(!arguments.length) return _pos;
			_pos = value;
			_cchar = _src.charAt(value);
			_ccode = _cchar.charCodeAt(0);
			self.skipWs();
		},

		/**
		 */

		row: function () {
			var p = this.pos();
			return _src.substr(0, p).split("\n").length;
		},

		/**
		 */

		column: function () {

			var rows = _src.split("\n"), p = this.pos(), row, cp = 0;

			for (var i = 1, n = rows.length; i < n; i++) {

				row = rows[i];
				cp += row.length;

				if (cp > p) {
					break;
				}

				p -= cp;

			}

			return p;
		},

		/**
		 */

		skip: function(count) {
			return self.pos(Math.min(_pos + count, _len))
		},


		/**
		 */

		rewind: function(count) {
			_pos = Math.max(_pos - count || 1, 0);
			return _pos;
		},

		/**
		 */

		peek: function(count) {
			return _src.substr(_pos, count || 1);
		},

		/**
		 */

		nextChar: function() {
			self.pos(_pos + 1);
			self.skipWs();

			return _cchar;
		},

		/**
		 */

		skipWs: function(force) {
			if(force || options.skipWhitespace) {
				if(self.isWs()) {
					self.nextChar();
				}
			}
		},

		/**
		 */

		cchar: function() {
			return _cchar;
		},

		/**
		 */

		ccode: function() {
			return _ccode;
		},

		/**
		 */

		isAZ: function() {
			return (_ccode > 64 && _ccode < 91) || (_ccode > 96 && _ccode < 123);
		},

		/**
		 */

		is09: function() {
			return _ccode > 47 && _ccode < 58;
		},

		/**
		 */

		isWs: function() {
			//\t \n \r \s
			return _ccode === 9 || _ccode === 10 || _ccode === 13 || _ccode === 32;
		},

		/**
		 */

		isAlpha: function() {
			return self.isAZ() || self.is09();
		},

		/**
		 */

		matches: function(search) {
			return !!_src.substr(_pos).match(search);
		},

		/**
		 */

		next: function(search) {
			var buffer = _src.substr(_pos),
			match      = buffer.match(search);
			_pos += match.index + Math.max(0, match[0].length - 1);
			return match[0];
		},

		/**
		 */

		nextWord: function() {
			if(self.isAZ()) return self.next(/[a-zA-Z]+/);
		},

		/**
		 */

		nextNumber: function() {
			if(self.is09()) return self.next(/[0-9]+/);
		},

		/**
		 */

		nextAlpha: function() {
			if(self.isAlpha()) return self.next(/[a-zA-Z0-9]+/);
		},

		/**
		 */

		nextNonAlpha: function() {
			if(!self.isAlpha()) return self.next(/[^a-zA-Z0-9]+/);
		},

		/**
		 */

		nextWs: function() {
			if(self.isWs()) return self.next(/[\s\r\n\t]+/);
		},

		/**
		 */

		nextUntil: function(match) {
			var buffer = "";
			while(!self.eof() && !_cchar.match(match)) {
				buffer += _cchar;
				self.nextChar();
			}
			return buffer;
		},


		/**
		 */

		to: function(count) {
			var buffer = _src.substr(_pos, count);
			_pos += count;
			return buffer;
		}

	}


	//initialize
	self.source(source);


	return self;
}