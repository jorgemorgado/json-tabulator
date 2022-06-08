// Globals go here
const columnDefs_base = [
    {
        lockPosition: 'left',
        valueGetter: 'node.rowIndex',
        cellClass: 'locked-col',
        width: 60,
        suppressNavigable: true,
    },
];

const gridOptions_base = {
    // columnDefs: columnDefs,
    defaultColDef: {
        flex: 1,
        width: 150,
        resizable: true,
        // allow every column to be aggregated
        enableValue: true,
        // allow every column to be grouped
        enableRowGroup: true,
        // allow every column to be pivoted
        enablePivot: true,
        sortable: true,
        filter: true,
    },
    suppressDragLeaveHidesColumns: true,
    sideBar: 'columns',
};

var json = {};
var gridOptions;

// Possible alert types are: success, danger, warning
function flashAlert(type, message) {
    const close_alert = '<a href="#" class="close" data-dismiss="alert">&times;</a>';
    var element = '#' + type + '-alert';

    $(element).html(close_alert + message);

    $(element).show();
    $(element).fadeTo(2000, 500).slideUp(500, function() {
        $(element).slideUp(500);
    });
}

// Read a local file and progress to the JSON viewer
function readBlob(start_byte, stop_byte) {
    var files = document.getElementById('files').files;
    if (!files.length) {
        flashAlert('danger', 'Please select a valid JSON file!');
        return;
    }

    var file = files[0];
    var start = parseInt(start_byte) || 0;
    var stop = parseInt(stop_byte) || file.size - 1;

    var reader = new FileReader();

    // If we use onloadend, we need to check the readyState
    reader.onloadend = function(evt) {
        if (evt.target.readyState == FileReader.DONE) { // DONE == 2
            try {
                $('#byte-range').html(['Total size: ', file.size, ' byte'].join(''));

                json = JSON.parse(evt.target.result);
                $("#json").JSONView(json, { collapsed: true, nl2br: true });
            }
            catch (err) {
                flashAlert('danger', 'Invalid JSON:' + err);
                return;
            }
        }
    };

    var blob = file.slice(start, stop + 1);
    reader.readAsBinaryString(blob);
}
