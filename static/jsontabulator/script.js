// Check for the various File API support.
if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
    var msg = 'The File APIs are not supported in this browser.';

    alert(msg);
    throw new Error(msg);
}

// Buttons code goes here
$(function() {
    // Load file button will read the JSON blob
    $('#load-btn').on('click', function() {
        readBlob();
    });

    // Initialize the JSON viewer object
    $("#json").JSONView(json, { collapsed: true, nl2br: true });

    // JSON expand/collapse, toggle levels buttons
    $('#collapse-btn').on('click', function() {
        $('#json').JSONView('collapse');
    });
    $('#expand-btn').on('click', function() {
        $('#json').JSONView('expand');
    });
    $('#toggle-btn').on('click', function() {
        $('#json').JSONView('toggle');
    });
    $('#toggle-level1-btn').on('click', function() {
        $('#json').JSONView('toggle', 1);
    });
    $('#toggle-level2-btn').on('click', function() {
        $('#json').JSONView('toggle', 2);
    });

    // JSON tabulate button
    $('#tabulate-btn').on('click', function() {
        // Where to find the dictionary/node in the JSON content
        var json_path = document.querySelector('#nodes').value;

        // Clean the previous grid
        $('#myGrid').html('');

        // const nodes = ['config', 'firewalls', 'policy'];
        const nodes = json_path.split('.');

        var dict = json;
        for (var n = 0; n < nodes.length; n++) {
            if (nodes[n] in dict) {
                dict = dict[nodes[n]];
            } else {
                flashAlert('danger', 'Invalid JSON path! Please re-check the JSON nodes.');
                return;
            }
        }

        var [first] = Object.keys(dict);
        // console.log('(DEBUG) First item in dict: ' + first);

        var keys = Object.keys(dict[first]);
        // console.log('(DEBUG) keys in dict: ' + keys);

        // We need at least 2 keys to display a table
        if (keys.length < 2) {
            flashAlert('warning', 'There is nothing to tabulate at this level. Please try one level up!');
            return;
        }

        // Populate the column definitions from the select dictionary key(s)
        var columnDefs = columnDefs_base;
        columnDefs.push( { field: 'id' } );
        for (var i = 0; i < keys.length; i++) {
            columnDefs.push( { field: keys[i] } );
        }

        // Grid options, including the column definitions
        var gridOptions = gridOptions_base;
        gridOptions['columnDefs'] = columnDefs;

        const gridDiv = document.querySelector('#myGrid');
        new agGrid.Grid(gridDiv, gridOptions);

        // Add data to the grid
        var data = [];
        jQuery.each(dict, function(i, val) {
            val['id'] = i;
            data.push(val);
        });

        gridOptions.api.setRowData(data);
        gridOptions.api.hideOverlay();
    });

    // Table export to CSV button
    $('#export-btn').on('click', function() {
        if (gridOptions) {
            gridOptions.api.exportDataAsCsv({
                skipHeader: false,
                skipFooters: true,
                skipGroups: true,
                fileName: "export.csv"
            });
        }
    });
});
