
  function downloadPDF() {
    // Select the element to be converted to PDF
    const element = document.getElementById('NewInfo');

    // Options for the PDF generation
    const options = {
      margin: 10,
      filename: 'results.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Use html2pdf library to generate PDF
    html2pdf(element, options);
  }
  function exportTableToExcel() {
    // Get the table element
    const table = document.getElementById('results-table');

    // Convert the table to a worksheet
    const ws = XLSX.utils.table_to_sheet(table);

    // Create a workbook with a single sheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Save the workbook as an Excel file
    XLSX.writeFile(wb, 'results.xlsx');
}

    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
    let pdfinput = document.querySelector(".selectpdf"); // Reference to the PDF file input field
    let pwd = document.querySelector(".pwd"); // Reference to the password input field
    let upload = document.querySelector(".upload"); // Reference to the upload button
    let afterupload = document.querySelector(".afterupload"); // Reference to the result section
    let select = document.querySelector("select"); // Reference to the page selection dropdown
    let download = document.querySelector(".download"); // Reference to the download link
    let pdftext = document.querySelector(".pdftext"); // Reference to the text area for displaying extracted text
    
    // Event listener for the upload button click
    upload.addEventListener('click', () => {
        let file = pdfinput.files[0]; // Get the selected PDF file
        if (file != undefined && file.type == "application/pdf") {
            let fr = new FileReader(); // Create a new FileReader object
            fr.readAsDataURL(file); // Read the file as data URL
            fr.onload = () => {
                let res = fr.result; // Get the result of file reading
                if (pwd.value == "") {
                    extractText(res, false); // Extract text without password
                } else {
                    extractText(res, true); // Extract text with password
                }
            }
        } else {
            alert("Select a valid PDF file");
        }
     

    });
    
    let alltext = []; // Array to store all extracted text
    // Asynchronous function to extract text from the PDF
    async function extractText(url, pass) {
        try {
            let pdf;
            if (pass) {
                pdf = await pdfjsLib.getDocument({ url: url, password: pwd.value }).promise; // Get the PDF document with password
            } else {
                pdf = await pdfjsLib.getDocument(url).promise; // Get the PDF document without password
            }
            let pages = pdf.numPages; // Get the total number of pages in the PDF
            for (let i = 1; i <= pages; i++) {
                let page = await pdf.getPage(i); // Get the page object for each page
                let txt = await page.getTextContent(); // Get the text content of the page
                let text = txt.items.map((s) => s.str).join(""); // Concatenate the text items into a single string
                alltext.push(text); // Add the extracted text to the array
            }
            alltext.map((e, i) => {
                select.innerHTML += `<option value="${i+1}">${i+1}</option>`; // Add options for each page in the page selection dropdown
            });
            // afterProcess(); // Display the result section
            newbala();

        } catch (err) {
            alert(err.message);
        }
    }

    function ConvertFor(marksheetString){
marksheetString = marksheetString.replace("Name", "\nName");
marksheetString = marksheetString.replace("Semester", "\nSemester");
marksheetString = marksheetString.replace("Subject", "\nSubject");
marksheetString = marksheetString.replace("Course", "\nCourse");

for (let i=1;i<10;i++) {
  for(let j=1;j<10;j++){
  let k="BT"+i+"0"+j+"- [T]";
  marksheetString = marksheetString.replace(k, "\n" + k);
  }
}
for (let i=1;i<10;i++) {
  for(let j=1;j<10;j++){
  let k="BT"+i+"0"+j+"- [P]";
  marksheetString = marksheetString.replace(k, "\n" + k);
  }
}
for (let i=1;i<8;i++) {
  for(let j=1;j<8;j++){
  let k="CS"+i+"0"+j+"- [T]";
  marksheetString = marksheetString.replace(k, "\n" + k);
  }
}
for (let i=1;i<8;i++) {
  for(let j=1;j<8;j++){
  let k="CS"+i+"0"+j+"- [P]";
  marksheetString = marksheetString.replace(k, "\n" + k);
  }
}

marksheetString = marksheetString.replace("NC0", "\nNC0");
marksheetString = marksheetString.replace("Result", "\nResult");
marksheetString = marksheetString.replace("CGPA", "CGPA\n");
marksheetString = marksheetString.replace("Data ", "\nData ");
marksheetString = marksheetString.replace("Revaluation", "\nRevaluation");
marksheetString = marksheetString.replace("Late Fee", "Late Fee\n");
marksheetString = marksheetString.replace("BT408- [N]", "\nBT408- [N]");
marksheetString = marksheetString.replace("BT409", "\nBT409");
marksheetString = marksheetString.replace("BT409", "\nBT409");

return marksheetString;

}


function parseMarksheetString(marksheetString) {
  document.querySelector("#Main").style.display = "block";
  const lines = marksheetString.split(/\r?\n/).filter(line => line.trim() !== '');
  const data = {
    name: '',
    rollNo: '',
    course: '',
    branch: '',
    semester: 0,
    status: '',
    subjects: [],
    sgpa: 0,
    cgpa: 0,
    passStatus: '',
    revaluationDate: '',
    lateFeeRevaluationDate: ''
  };

  let subjectSection = false;
  for (let i = 0; i < lines.length; i++) {
    const trimmedLine = lines[i].trim();
    if (trimmedLine.startsWith('Name')) {
      const [name, rollNo] = trimmedLine.split('Roll No.');
      data.name = name.replace('Name', '').trim();
      data.rollNo = rollNo.trim();
    } else if (trimmedLine.startsWith('Course')) {
      const [course, branch] = trimmedLine.split('Branch');
      data.course = course.replace('Course', '').trim();
      data.branch = branch.trim();
    } else if (trimmedLine.startsWith('Semester')) {
      const [semester, status] = trimmedLine.split('Status');
      data.semester = parseInt(semester.replace('Semester', '').trim(), 10);
      data.status = status.trim();
    } else if (trimmedLine.startsWith('Subject')) {
      subjectSection = true;
    }
    else if (trimmedLine.includes('Revaluation')) {
      const nextLine = lines[i + 1];
      const [revaluationDate, lateFeeRevaluationDate] = nextLine.split(" ");
      data.revaluationDate = revaluationDate.replace('Revaluation Date', '').trim();
      data.lateFeeRevaluationDate = lateFeeRevaluationDate.trim();
    } else if (subjectSection && trimmedLine.includes('Result Des.')) {
      const nextLine = lines[i + 1];
      const k = nextLine.split(" ");
      data.passStatus=k[k.length-3];
      data.sgpa = parseFloat(k[k.length-2]);
      data.cgpa = parseFloat(k[k.length-1]);
    }else if (subjectSection) {
      const [codeType, credits, earnedCredits, grade] = trimmedLine.split(/\s+/);
      const [code, type] = codeType.split(/[\[\]]/);
      if(grade==0 || grade==1 || grade==2 || grade==3 || grade==4  || grade==5 || grade==6){
      data.subjects.push({
        code: `[${code.slice(0, -1)}]`,
        earnedCredits: parseInt(earnedCredits, 10),
        grade
      });
    }
    }
  }

  return data;
}
function newbala(){
for (let i = 0; i < alltext.length; i++) {
    const reversedFormattedMarksheet = alltext[i];
const converted =ConvertFor(reversedFormattedMarksheet);
const parsedMarksheet = parseMarksheetString(converted);
insertDataIntoTable(parsedMarksheet);
}
}
var countPass = 0;
var countFail = 0;

function insertDataIntoTable(dataArray) {
    var tableBody = document.getElementById('results-table').getElementsByTagName('tbody')[0];
    var data = dataArray;

    // Check if the data already exists in the table
    if (!isDataAlreadyExists(data)) {
        var newRow = tableBody.insertRow(tableBody.rows.length);
        var nameCell = newRow.insertCell(0);
        var rollNoCell = newRow.insertCell(1);
        var CourseCell = newRow.insertCell(2);
        var semesterCell = newRow.insertCell(3);
        var branchCell = newRow.insertCell(4);
        var statusCell = newRow.insertCell(5);
        var cgpaCell = newRow.insertCell(6);
        var sgpaCell = newRow.insertCell(7);

        nameCell.innerHTML = data.name;
        rollNoCell.innerHTML = data.rollNo;
        CourseCell.innerHTML = data.course;
        semesterCell.innerHTML = data.semester;
        branchCell.innerHTML = data.branch;
        
        if (data.passStatus !== "PASS" && data.passStatus !== "GRACE") {
            statusCell.innerHTML = "Fail";
            countFail++;
        } else {
            statusCell.innerHTML = data.passStatus;
            countPass++;
        }

        cgpaCell.innerHTML = data.cgpa;
        sgpaCell.innerHTML = data.sgpa;

        document.getElementById('pass-count').textContent = countPass;
        document.getElementById('fail-count').textContent = countFail;
    } 
}

function isDataAlreadyExists(data) {
    var tableRows = document.getElementById('results-table').getElementsByTagName('tbody')[0].rows;
    for (var i = 0; i < tableRows.length; i++) {
        var row = tableRows[i];
        // Assuming the first cell (index 0) contains the name data
        var existingName = row.cells[0].innerHTML;
        
        if (existingName === data.name ) {
            return true; // Data already exists
        }
    }

    return false; // Data does not exist
}