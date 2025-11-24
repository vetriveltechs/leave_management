// === COMMON.JS ===

// === FORMAT DATE ===
function formatDate(dateStr) {
    if (!dateStr) return "";
    let d = new Date(dateStr);
    if (isNaN(d)) return "";
    return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).replace(/ /g, "-"); // e.g. 22-Dec-2025
}

// === RENDER PAGINATION ===
function renderPagination(totalPages, currentPage, onPageChange) {
    if (totalPages <= 1) {
        $('#pagination').empty();
        return;
    }

    let pagHtml = '<nav><ul class="pagination pagination-sm justify-content-end">';

    // First & Prev
    pagHtml += `<li class="page-item ${currentPage === 1 ? 'disabled':''}">
                    <a href="#" class="page-link page-first">First</a>
                </li>`;
    pagHtml += `<li class="page-item ${currentPage === 1 ? 'disabled':''}">
                    <a href="#" class="page-link page-prev">Prev</a>
                </li>`;

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    if(start > 1){
        pagHtml += `<li class="page-item"><a href="#" class="page-link page-num" data-page="1">1</a></li>`;
        if(start > 2){
            pagHtml += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }

    for(let i = start; i <= end; i++){
        pagHtml += `<li class="page-item ${i===currentPage ? 'active':''}">
                        <a href="#" class="page-link page-num" data-page="${i}">${i}</a>
                    </li>`;
    }

    if(end < totalPages){
        if(end < totalPages - 1){
            pagHtml += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
        pagHtml += `<li class="page-item"><a href="#" class="page-link page-num" data-page="${totalPages}">${totalPages}</a></li>`;
    }

    // Next & Last
    pagHtml += `<li class="page-item ${currentPage === totalPages ? 'disabled':''}">
                    <a href="#" class="page-link page-next">Next</a>
                </li>`;
    pagHtml += `<li class="page-item ${currentPage === totalPages ? 'disabled':''}">
                    <a href="#" class="page-link page-last">Last</a>
                </li>`;

    pagHtml += '</ul></nav>';
    $('#pagination').html(pagHtml);

    // Events
    $(document).off("click", ".page-num, .page-prev, .page-next, .page-first, .page-last");

    $(document).on("click", ".page-num", function(e){
        e.preventDefault();
        onPageChange(parseInt($(this).data("page")));
    });

    $(document).on("click", ".page-prev", function(e){
        e.preventDefault();
        if(currentPage > 1) onPageChange(currentPage - 1);
    });

    $(document).on("click", ".page-next", function(e){
        e.preventDefault();
        if(currentPage < totalPages) onPageChange(currentPage + 1);
    });

    $(document).on("click", ".page-first", function(e){
        e.preventDefault();
        onPageChange(1);
    });

    $(document).on("click", ".page-last", function(e){
        e.preventDefault();
        onPageChange(totalPages);
    });
}

// === EXPORT DATA ===
function exportData(type, title, data) {
    if (!data || data.length === 0) return;

    if (type === "csv" || type === "excel") {
        let ws = XLSX.utils.json_to_sheet(data);
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, title);

        if (type === "csv") { 
            XLSX.writeFile(wb, `${title.toLowerCase()}.csv`, { bookType: "csv" }); 
        } else { 
            XLSX.writeFile(wb, `${title.toLowerCase()}.xlsx`, { bookType: "xlsx" }); 
        }
    }

    if (type === "pdf") {
        const { jsPDF } = window.jspdf;
        let doc = new jsPDF();
        doc.autoTable({
            head: [Object.keys(data[0])],
            body: data.map(row => Object.values(row))
        });
        doc.save(`${title.toLowerCase()}.pdf`);
    }
}

// === PRINT DATA ===
function printData(title, data) {
    if (!data || data.length === 0) return;
    let newWin = window.open("");
    newWin.document.write("<html><head><title>Print</title></head><body>");
    newWin.document.write(`<h3>${title}</h3>`);
    newWin.document.write("<table border='1' cellspacing='0' cellpadding='5'><thead><tr>");

    Object.keys(data[0]).forEach(col => {
        newWin.document.write(`<th>${col}</th>`);
    });
    newWin.document.write("</tr></thead><tbody>");

    data.forEach(row => {
        newWin.document.write("<tr>");
        Object.values(row).forEach(val => {
            newWin.document.write(`<td>${val}</td>`);
        });
        newWin.document.write("</tr>");
    });

    newWin.document.write("</tbody></table>");
    newWin.document.write("</body></html>");
    newWin.document.close();
    newWin.print();
}
