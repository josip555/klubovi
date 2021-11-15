var table;

$(document).ready(function () {
    // Setup - add a text input to each footer cell
    $('#datatable tfoot th').each(function () {
        var title = $(this).text();
        $(this).html('<input type="text" placeholder="Search ' + title + '" />');
    });

    table = $('#datatable').DataTable({
        
        initComplete: function () {
            // Apply the search
            this.api().columns().every(function () {
                var that = this;

                $('input', this.footer()).on('keyup change clear', function () {
                    if (that.search() !== this.value) {
                        that
                            .search(this.value)
                            .draw();
                    }
                });
            });
        },
        scrollX: true,
        ajax: {
            url: '/allrows',
            dataSrc: ''
        },
        columnDefs: [{
                targets: [5, 11],
                render: function (data) {
                    return (new Date(data)).toLocaleDateString();
                }
            },
            {
                targets: [0],
                visible: false,
                searchable: false
            }
        ],
        columns: [{
                'data': 'igrac_id'
            },
            {
                'data': 'ime'
            },
            {
                'data': 'prezime'
            },
            {
                'data': 'igrac_drzava'
            },
            {
                'data': 'pozicija'
            },
            {
                'data': 'datum_rod'
            },
            {
                'data': 'klub_naziv'
            },
            {
                'data': 'kratica'
            },
            {
                'data': 'nadimak'
            },
            {
                'data': 'klub_grad'
            },
            {
                'data': 'klub_drzava'
            },
            {
                'data': 'osnovan'
            },
            {
                'data': 'predsjednik'
            },
            {
                'data': 'trener'
            },
            {
                'data': 'liga'
            },
            {
                'data': 'web'
            },
            {
                'data': 'stadion_naziv'
            },
            {
                'data': 'stadion_grad'
            },
            {
                'data': 'stadion_drzava'
            },
            {
                'data': 'adresa'
            },
            {
                'data': 'kapacitet'
            },
            {
                'data': 'podloga'
            }
        ]
    });
})

function downloadCSV(){
    console.log("CSV button clicked.");
    console.log(table.rows( { search:'applied' } )[0]);

    var ids = table.rows( { search:'applied' } )[0];
    ids = ids.map(v=> v+1);
    console.log(ids);
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ids)
    }
    fetch('/download/filteredcsv', options).then((res) => { return res.blob(); })
    .then((data) => {
      var a = document.createElement("a");
      a.href = window.URL.createObjectURL(data);
      a.download = "fklubovi.csv";
      a.click();
    });
}

function downloadJSON(){
    console.log("CSV button clicked.");
    console.log(table.rows( { search:'applied' } )[0]);

    var ids = table.rows( { search:'applied' } )[0];
    ids = ids.map(v=> v+1);
    console.log(ids);
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ids)
    }
    fetch('/download/filteredjson', options).then((res) => { return res.blob(); })
    .then((data) => {
      var a = document.createElement("a");
      a.href = window.URL.createObjectURL(data);
      a.download = "fklubovi.json";
      a.click();
    });
}
