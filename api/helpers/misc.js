//Misc Helper Functions

module.exports = function(server, restify) {  
    server.slugify = function(text) {
      return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
    },
      
    server.processUpdateQueryFromBody = function(req, tableName,whereCond,extraFields = "edited_on=?") {
      dated = new Date();
      
      strUpdate = [];
      _.each(req.body, function(a,b) {
        strUpdate.push(b+'=?');
      });
      strSQL = "UPDATE "+tableName+" SET "+strUpdate.join(", ")+","+extraFields+" WHERE "+whereCond;
      
      dataValues = Object.values(req.body);
      
      if(extraFields == "edited_on=?") {
        dataValues.push(dated);
      }
      
      return {
        "sql" : strSQL,
        "data" : dataValues
      };
    }
}