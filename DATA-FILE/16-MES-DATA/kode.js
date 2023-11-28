function doPost(e) {
    try {
    var data = e.parameter.fileContent;
    var filename = e.parameter.filename;
    var email = e.parameter.email;
    var nama = e.parameter.nama;
    var result=uploadFileToGoogleDrive(data,filename,nama,email,e);
    return ContentService // return to JSON results successful
    .createTextOutput(
    JSON.stringify({"You have successfully registered":"Data has been sent",
    "data": JSON.stringify(result) }))
    .setMimeType(ContentService.MimeType.JSON);
    } catch(error) { // come back here if there is an error
    Logger.log(error);
    return ContentService
    .createTextOutput(JSON.stringify({"result":"error", "error": error}))
    .setMimeType(ContentService.MimeType.JSON);
    }
    }
    // new property service GLOBAL
    var SCRIPT_PROP = PropertiesService.getScriptProperties();
    // see: https://developers.google.com/apps-script/reference/properties/
    /**
    * pilih sheet
    */
    function setup() {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    SCRIPT_PROP.setProperty("1b4Lfw8ulh3DNPUUyOaHk7HueNVPB1ZAeoobo7rfJgbo", doc.getId());
    }
    /**
    * record_data is insert data received from HTML form submission
    * e is the data received from POST
    */
    function record_data(e,fileUrl) {
    try {
    var doc = SpreadsheetApp.openById('1b4Lfw8ulh3DNPUUyOaHk7HueNVPB1ZAeoobo7rfJgbo');
    var sheet = doc.getSheetByName('BSNHS'); // select response sheet
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow()+1; // get the next line
    var row = [ new Date() ]; // The first element in the line must always begin with a timestamp
    // loop through the header columns
    for (var i = 1; i < headers.length; i++) { // start at 1 to avoid the timestamp column
    if(headers[i].length > 0 && headers[i] == "file") {
    row.push(fileUrl); // add data to the row
    }
    else if(headers[i].length > 0) {
    row.push(e.parameter[headers[i]]); // add data to the row
    }
    }
    // more efficient to set values as [][] array than individually
    sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
    }
    catch(error) {
    Logger.log(e);
    }
    finally {
    return;
    }
    }
    function uploadFileToGoogleDrive(data, file, name, email,e) {
    try {
    var dropbox = "SOUTH II DATA 2023";
    var folder, folders = DriveApp.getFoldersByName(dropbox);
    if (folders.hasNext()) {
    folder = folders.next();
    } else {
    folder = DriveApp.createFolder(dropbox);
    }
    var contentType = data.substring(5,data.indexOf(';')),
    bytes = Utilities.base64Decode(data.substr(data.indexOf('base64,')+7)),
    blob = Utilities.newBlob(bytes, contentType, file);
    var file = folder.createFile(blob);
    var fileUrl=file.getUrl();
    record_data(e,fileUrl);
    
    return file.getUrl();
    } catch (f) {
    return ContentService // return to JSON results successful.
    .createTextOutput(
    JSON.stringify({"Maaf!":"Upload data gagal!",
    "data": JSON.stringify(f) }))
    .setMimeType(ContentService.MimeType.JSON);
    }
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    