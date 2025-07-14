QJS_ENABLE = $(shell command -v qjs | wc -l)
TJS_ENABLE = $(shell command -v tjs | wc -l)

test:
ifeq ($(TJS_ENABLE), 1)
	tjs run test.js
	tjs run testtjs.js
endif
ifeq ($(QJS_ENABLE), 1)
	qjs test.js
	qjs testqjs.js
endif
