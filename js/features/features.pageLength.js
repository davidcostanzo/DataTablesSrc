
var __lengthCounter = 0;

// opts
// - menu
// - text
_ext.features.register( 'pageLength', function ( settings, opts ) {
	// For compatibility with the legacy `pageLength` top level option
	if (! settings.oFeatures.bPaginate || ! settings.oFeatures.bLengthChange) {
		return null;
	}

	opts = $.extend({
		menu: settings.aLengthMenu,
		text: settings.oLanguage.sLengthMenu
	}, opts);

	var
		classes  = settings.oClasses,
		tableId  = settings.sTableId,
		menu     = opts.menu,
		lengths  = [],
		language = [];

	// Options can be given in a number of ways
	if (Array.isArray( menu[0] )) {
		// Old 1.x style - 2D array
		lengths = menu[0];
		language = menu[1];
	}
	else {
		for ( var i=0 ; i<menu.length ; i++ ) {
			// An object with different label and value
			if ($.isPlainObject(menu[i])) {
				lengths.push(menu[i].value);
				language.push(menu[i].label);
			}
			else {
				// Or just a number to display and use
				lengths.push(menu[i]);
				language.push(menu[i]);
			}
		}
	}

	// We can put the <select> outside of the label if it is at the start or
	// end which helps improve accessability (not all screen readers like
	// implicit for elements).
	var end = opts.text.match(/_MENU_$/);
	var start = opts.text.match(/^_MENU_/);
	var removed = opts.text.replace(/_MENU_/, '');
	var str = '<label>' + opts.text + '</label>';

	if (start) {
		str = '_MENU_<label>' + removed + '</label>';
	}
	else if (end) {
		str = '<label>' + removed + '</label>_MENU_';
	}

	// Wrapper element - use a span as a holder for where the select will go
	var div = $('<div>')
		.addClass( classes.sLength )
		.append(
			str.replace( '_MENU_', '<span></span>' )
		);

	// And the select itself, along with the options
	var select = $('<select/>', {
		'name':          tableId+'_length',
		'aria-controls': tableId,
		'class':         classes.sLengthSelect
	} );

	for ( var i=0, ien=lengths.length ; i<ien ; i++ ) {
		select[0][ i ] = new Option(
			typeof language[i] === 'number' ?
				settings.fnFormatNumber( language[i] ) :
				language[i],
			lengths[i]
		);
	}

	// add for and id to label and input
	div.find('label').attr('for', 'dt-length-' + __lengthCounter);
	select.attr('id', 'dt-length-' + __lengthCounter);
	__lengthCounter++;

	// Swap in the select list
	div.find('span').replaceWith(select);

	// Can't use `select` variable as user might provide their own and the
	// reference is broken by the use of outerHTML
	$('select', div)
		.val( settings._iDisplayLength )
		.on( 'change.DT', function(e) {
			_fnLengthChange( settings, $(this).val() );
			_fnDraw( settings );
		} );

	// Update node value whenever anything changes the table's length
	$(settings.nTable).on( 'length.dt.DT', function (e, s, len) {
		if ( settings === s ) {
			$('select', div).val( len );
		}
	} );

	return div;
} );
