QJS_ENABLE = $(shell command -v qjs | wc -l)
TJS_ENABLE = $(shell command -v tjs | wc -l)

test:
ifeq ($(TJS_ENABLE), 1)
	tjs run test.js
endif
ifeq ($(QJS_ENABLE), 1)
	qjs test.js
endif
