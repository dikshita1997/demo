//Datalist module

module.exports = function(server, restify) {

    server.get('/data', (req, res, next) => {
        res.send("No GroupID Defined");
        next();
    });

    server.get('/data/:groupid', (req, res, next) => {
        if (req.params.groupid == null || req.params.groupid.length <= 0) {
            res.send("No GroupID Found");
            next();
        } else {
            fields = req.params.fields;
            if (fields == null || fields.length <= 0 || fields == "*") fields = "title,value,class";
            server.mysql.query(
                'SELECT ' + fields + ' FROM do_lists WHERE groupid = ? ORDER BY sortorder DESC,title ASC', [req.params.groupid],
                function(err, results, fields) {
                    if (err) {
                        // console.log(err);
                        res.send("No Data Found for " + req.params.groupid);
                    } else res.send(results);
                    next();
                }
            );
        }
    });
}