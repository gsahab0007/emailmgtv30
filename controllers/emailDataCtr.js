const emailDataModel = require("../models/emailDataModel");
const flash = require('connect-flash');

// ------------------------ GET show all data page -------------------------
showallGetCtr = async (req, res) => {
    try {
        let data = await emailDataModel.find({}).sort({ "type": 1, "clg_code": 1 });

        let datahide = await emailDataModel.find({ hide: "yes" }).sort({ "type": 1, "clg_code": 1 });
        

        let arr = [];
        data.forEach(function (item1) {

                
            if (item1.email1) {
                arr.push(item1.email1)
            }
            if (item1.email2) {
                arr.push(item1.email2)
            }
            if (item1.email3) {
                arr.push(item1.email3)
            }
        }
    );
    // console.log("arr: ", datahide.length);
        res.status(200).render("showall", { data, datahidelength: datahide.length, title: "All Records", message: req.flash("message"), arrLength: arr.length });
    } catch (error) {
        console.log("error: ", error.message);
    }
};

// -------------------------- GET add new email page -------------------------
addClgGetCtr = (req, res) => {

    res.status(200).render("addClg", { message: req.flash("message"), title: "Add" });
};

// --------------------------------POST add new record---------------------------
addClgPostCtr = async (req, res) => {
    const { clg_code, clg_name, center_code, center_name, pr_name, pr_mobile, dealing_name, dealing_mobile, email1, email2, email3, address, district, type, remarks } = req.body;
    try {
        if (!(clg_code && type)) {
            req.flash("message", "Provide required data !")
            res.status(400).redirect("/api/show/addclg");
        }

        let data = await emailDataModel.findOne({ clg_code });
        if (!data) {
            const newData = new emailDataModel({
                clg_code, clg_name, center_code, center_name, pr_name, pr_mobile, dealing_name, dealing_mobile, email1, email2, email3, address, district, type, remarks
            });
            let saveData = await newData.save();
            if (saveData) {
                req.flash("message", "Record Saved Successfully !")
                res.status(201).redirect("/api/show/addclg");
            }
        } else {
            req.flash("message", "Data Already Exist !")
            res.status(400).redirect("/api/show/addclg");
        }

    } catch (error) {
        console.log('addClgPostCtr err: ', error.message);
    }
};

// ----------------------------- GET edit deptt college -----------------------------------
editClgGetCtr = async (req, res) => {
    try {

        if (req.query.clg_code) {
            const { clg_code } = req.query;

            let data = await emailDataModel.findOne({ clg_code });

            if (data) {
                res.status(200).render("editClg", { data, message: req.flash("message"), title: "Edit Deptt/College" });
            } else {
                res.status(400).render("editClg", { data, message: "Record not found !", title: "Edit Deptt/College" });
            }
        } else {
            res.status(200).render("editClg", { data: "", message: req.flash("message"), title: "Edit Deptt/College" });
        }

    } catch (error) {
        console.log('edit get error: ', error.message);
    }
};

// -------------------------------- POST edit deptt college ---------------------------------
editClgPostCtr = async (req, res) => {
    try {
        const { clg_code, clg_name, center_code, center_name, pr_name, pr_mobile, dealing_name, dealing_mobile, email1, email2, email3, address, district, type, remarks } = req.body;

        let newData = await emailDataModel.updateOne({ clg_code }, { clg_name, center_code, center_name, pr_name, pr_mobile, dealing_name, dealing_mobile, email1, email2, email3, address, district, type, remarks });

        if (newData) {
            req.flash("message", "Record Updated Successfully !")
            res.status(200).redirect("/api/show/editclg");
        }
    } catch (error) {
        console.log('edit ClgPostCtr err: ', error.message);
    }
};

// ------------------------------- GET Del rec deptt college--------------------------------------
delClgGetCtr = async (req, res) => {
    try {

        if (req.query.clg_code) {
            const { clg_code } = req.query;

            let data = await emailDataModel.findOne({ clg_code });

            if (data) {
                res.status(200).render("deleteClg", { data, message: req.flash("message"), title: "Delete Record Deptt/College" });
            } else {
                res.status(400).render("deleteClg", { data, message: "Record not found !", title: "Delete Record Deptt/College" });
            }
        } else {
            res.status(400).render("deleteClg", { data: "", message: "Kindly provide a valid college code", title: "Delete Record Deptt/College" });
        }

    } catch (error) {
        console.log('del get error: ', error.message);
    }
};

// ---------------------------- DELETE rec deptt college----------------------------------------
delClgDelCtr = async (req, res) => {
    const { clg_code } = req.body;
    try {

        let delData = await emailDataModel.deleteOne({ clg_code });
        if (delData) {
            req.flash("message", "Record Deleted Successfully !")
            res.status(200).redirect("/api/show/delclg");
        }
    } catch (error) {
        console.log('del Ctr err: ', error.message);
    }
};


// ------------------------------- GET hide rec deptt college--------------------------------------
hideClgGetCtr = async (req, res) => {
     try {

        if (req.query.clg_code) {
            const { clg_code } = req.query;

            let data = await emailDataModel.findOne({ clg_code });

            if (data) {
                res.status(200).render("hideClg", { data, message: req.flash("message"), title: "Hide Record Deptt/College" });
            } else {
                res.status(400).render("hideClg", { data, message: "Record not found !", title: "Hide Record Deptt/College" });
            }
        } else {
            res.status(200).render("hideClg", { data: "", message: req.flash("message"), title: "Hide Record Deptt/College" });
        }

    } catch (error) {
        console.log('hide get error: ', error.message);
    }
};

// ---------------------------- hide post rec deptt college----------------------------------------
hideClgPostCtr = async (req, res) => {
    const { clg_code } = req.body;
    try {

       const { hide } = req.body;

        let newData = await emailDataModel.updateOne({ clg_code }, {hide});

        if (newData) {
            req.flash("message", "Record Updated Successfully !")
            res.status(200).redirect("/api/show/hideclg");
        }
    } catch (error) {
        console.log('hide Ctr err: ', error.message);
    }
};

// -------------------- GET for copy paste deptt/clgs/neighbourhood clgs wise ----------------------
emailForCopyGetCtr = async (req, res) => {
    try {
        // deptt
        const deptt = await emailDataModel.find(
            { $or: [{ type: "deptts" }, { type: "Deptts" }] },
            { email1: 1, email2: 1, email3: 1, _id: 0 }
        ).sort({ clg_code: 1 });

        // -------------------Push code----------------------------
         let ar = [];        
        deptt.forEach(function (item1) {
        if (item1.email1 ) {            
            ar.push(item1.email1.trim().toLowerCase());
        }
        if (item1.email2 ) {
            ar.push(item1.email2.trim().toLowerCase());
        }
        if (item1.email3 ) {
            ar.push(item1.email3.trim().toLowerCase());
        }
    });


    // Remove duplicate emails
    let uniqueEmails = [...new Set(ar)];
    let duplicates = ar.filter((item, index) => ar.indexOf(item) !== index);    
    
//for count show 
    let depttCount1 = uniqueEmails.slice(0, 45).length;
    let depttCount2 = uniqueEmails.slice(45, 85).length;
    let depttCount3 = uniqueEmails.slice(85, 125).length;

// for string show with comma
    let depttStr1 = uniqueEmails.slice(0, 45).join(", ");
    let depttStr2 = uniqueEmails.slice(45, 85).join(", ");
    let depttStr3 = uniqueEmails.slice(85, 125).join(", ");


        let depttTotEmails = depttCount1 + depttCount2 + depttCount3 ;

        // neighbourhood regional
        const data2 = await emailDataModel.find(
            { type: "NCRC" },
            { email1: 1, email2: 1, email3: 1, _id: 0 }
        ).sort({ clg_code: 1 });
        
         let ar1 = [];        
        data2.forEach(function (item1) {
        if (item1.email1) {            
            ar1.push(item1.email1.trim().toLowerCase());
        }
        if (item1.email2) {
            ar1.push(item1.email2.trim().toLowerCase());
        }
        if (item1.email3) {
            ar1.push(item1.email3.trim().toLowerCase());
        }        
    });

        let uniqueNCRCEmails = [...new Set(ar1)];   
        let duplicatesNCRC = ar1.filter((item, index) => ar1.indexOf(item) !== index);

        // for count
        let countNCRC = uniqueNCRCEmails.length;

        // for string show with comma
        let strNCRC = uniqueNCRCEmails.join(", ");


        //------------------------------------------------- constituent--------------------------

        const data3 = await emailDataModel.find(
            { type: "Constituent" },
            { email1: 1, email2: 1, email3: 1, _id: 0 }
        ).sort({ clg_code: 1 });

        let constituent = "";

        let ar2 = [];
        data3.forEach(function (item1) {
        if (item1.email1 ) {
            ar2.push(item1.email1.trim().toLowerCase());
        }   
        if (item1.email2 ) {
            ar2.push(item1.email2.trim().toLowerCase());
        }   
        if (item1.email3 ) {
            ar2.push(item1.email3.trim().toLowerCase());
        }
    });

        let uniqueConstituentEmails = [...new Set(ar2)];
        let duplicatesConstituent = ar2.filter((item, index) => ar2.indexOf(item) !== index);

        let strConstituent = uniqueConstituentEmails.join(", ");
        let countConstituent = uniqueConstituentEmails.length;

        // Pvt clg
        const data4 = await emailDataModel.find(
            { $or: [{ type: "Pvt" }, { type: "pvt" }] },
            { email1: 1, email2: 1, email3: 1, _id: 0 }
        ).sort({ clg_code: 1 });
        
        let ar3 = [];
        data4.forEach(function (item1) {
        if (item1.email1 ) {
            ar3.push(item1.email1.trim().toLowerCase());
        }   
        if (item1.email2 ) {
            ar3.push(item1.email2.trim().toLowerCase());
        }
        if (item1.email3 ) {
            ar3.push(item1.email3.trim().toLowerCase());
        }
    });

         // Remove duplicate emails
         let uniquePvtClgEmails = [...new Set(ar3)];
         let duplicatesPvtClg = ar3.filter((item, index) => ar3.indexOf(item) !== index);
       
        // for count show
        let pvtClgCount1 = uniquePvtClgEmails.slice(0, 50).length;
        let pvtClgCount2 = uniquePvtClgEmails.slice(50, 100).length;
        let pvtClgCount3 = uniquePvtClgEmails.slice(100, 150).length;
        let pvtClgCount4 = uniquePvtClgEmails.slice(150, 200).length;
        let pvtClgCount5 = uniquePvtClgEmails.slice(200, 250).length;
        let pvtClgCount6 = uniquePvtClgEmails.slice(250, 300).length;
        let pvtClgCount7 = uniquePvtClgEmails.slice(300, 350).length;
        let pvtClgCount8 = uniquePvtClgEmails.slice(350, 400).length;
        let pvtClgCount9 = uniquePvtClgEmails.slice(400, 450).length;

         // for string show with comma        
        let emailPvtClg1 = uniquePvtClgEmails.slice(0, 50).join(", ");
        let emailPvtClg2 = uniquePvtClgEmails.slice(50, 100).join(", ");
        let emailPvtClg3 = uniquePvtClgEmails.slice(100, 150).join(", ");
        let emailPvtClg4 = uniquePvtClgEmails.slice(150, 200).join(", ");
        let emailPvtClg5 = uniquePvtClgEmails.slice(200, 250).join(", ");
        let emailPvtClg6 = uniquePvtClgEmails.slice(250, 300).join(", ");
        let emailPvtClg7 = uniquePvtClgEmails.slice(300, 350).join(", ");
        let emailPvtClg8 = uniquePvtClgEmails.slice(350, 400).join(", ");
        let emailPvtClg9 = uniquePvtClgEmails.slice(400, 450).join(", ");

        // -----------------------------------others----------------------------
        const data5 = await emailDataModel.find(
            { type: "Others" },
            { email1: 1, email2: 1, email3: 1, _id: 0 }
        ).sort({ clg_code: 1 });

        let ar5 = [];
        data5.forEach(function (item1) {
            if (item1.email1 ) {
                ar5.push(item1.email1.trim().toLowerCase());
            }
            if (item1.email2 ) {
                ar5.push(item1.email2.trim().toLowerCase());
            }
            if (item1.email3 ) {
                ar5.push(item1.email3.trim().toLowerCase());
            }
        });
            let uniqueOthersEmails = [...new Set(ar5)];
            let duplicatesOthers = ar5.filter((item, index) => ar5.indexOf(item) !== index);

            let countOthers = uniqueOthersEmails.length;
            let strOthers = uniqueOthersEmails.join(", ");


        // ---------------examination sets-------------
        const data6 = await emailDataModel.find(
            { type: "esets" },
            { email1: 1, email2: 1, email3: 1, _id: 0 }
        ).sort({ clg_code: 1 });

        let ar4 = [];
        data6.forEach(function (item1) {
            if (item1.email1 ) {   
                ar4.push(item1.email1.trim().toLowerCase());
            }
            if (item1.email2 ) {
                ar4.push(item1.email2.trim().toLowerCase());
            }
            if (item1.email3 ) {
                ar4.push(item1.email3.trim().toLowerCase());
            }
        });

        let uniqueEsetsEmails = [...new Set(ar4)];
        let duplicatesEsets = ar4.filter((item, index) => ar4.indexOf(item) !== index);

        let countEsets = uniqueEsetsEmails.length;  
        let strEsets = uniqueEsetsEmails.join(", ");

        //------------------- Govt clgs-----------------
        const data7 = await emailDataModel.find(
            { type: "govt" },
            { email1: 1, email2: 1, email3: 1, _id: 0 }
        ).sort({ clg_code: 1 });

        let ar6 = [];
        data7.forEach(function (item1) {
            if (item1.email1) {   
                ar6.push(item1.email1.trim().toLowerCase());
            }
            if (item1.email2 ) {
                ar6.push(item1.email2.trim().toLowerCase());
            }
            if (item1.email3 ) {
                ar6.push(item1.email3.trim().toLowerCase());
            }
        });

        let uniqueGovtEmails = [...new Set(ar6)];
        let duplicatesGovt = ar6.filter((item, index) => ar6.indexOf(item) !== index);
        
        let countGovt = uniqueGovtEmails.length;    
        let strGovt = uniqueGovtEmails.join(", ");

    
        //------------End govt clgs--------------------------------- 

        let pvtTotEmails = pvtClgCount1 + pvtClgCount2 + pvtClgCount3 + pvtClgCount4 + pvtClgCount5 + pvtClgCount6 + pvtClgCount7 + pvtClgCount8 + pvtClgCount9;

        let totalEmails = depttTotEmails + countNCRC + countConstituent + pvtTotEmails + countOthers + countGovt + countEsets;

        res.status(200).render("emailscp", {
            depttStr1,
            depttStr2,
            depttStr3,
            depttCount1,
            depttCount2,
            depttCount3,         

            strNCRC,
            countNCRC,

            strConstituent,
            countConstituent,
            
            emailPvtClg1,
            emailPvtClg2,
            emailPvtClg3,
            emailPvtClg4,
            emailPvtClg5,
            emailPvtClg6,
            emailPvtClg7,
            emailPvtClg8,
            emailPvtClg9,

            pvtClgCount1,
            pvtClgCount2,
            pvtClgCount3,
            pvtClgCount4,
            pvtClgCount5,
            pvtClgCount6,
            pvtClgCount7,
            pvtClgCount8,
            pvtClgCount9,

            strOthers,
            countOthers,

            strEsets,
            countEsets,

            strGovt,
            countGovt,

            depttTotEmails,
            pvtTotEmails,
            totalEmails,

            title: "Emails ids for Copy/Paste",
        });
    } catch (error) { console.log('err: ', error.message); }
};
// -------------------- GET for 50 50 email slot for copy paste ----------------------
email50GetCtr = async (req, res) => {
    let arr = [];
    let a = await emailDataModel.find({ "type": { $nin: ["Others", "esets"] } }, { email1: 1, email2: 1, email3: 1 }).sort({ "type": 1, "clg_code": 1 });

        
    a.forEach(function (item1) {
        if (item1.email1) {
            arr.push(item1.email1.trim().toLowerCase())
            
        }
        if (item1.email2) {
            arr.push(item1.email2.trim().toLowerCase())
        }
        if (item1.email3) {
            arr.push(item1.email3.trim().toLowerCase())
        }

    });

    // Remove duplicate emails
    let uniqueEmails = [...new Set(arr)];

    const duplicates = arr.filter((item, index) => arr.indexOf(item) !== index);


    // console.log("uniqueEmails: ", uniqueEmails.length);
   
    let totalEmails;
    let = emailSlot1 = "", emailSlot2 = "", emailSlot3 = "", emailSlot4 = "", emailSlot5 = "", emailSlot6 = "", emailSlot7 = "", emailSlot8 = "", emailSlot9 = "", emailSlot10 = "", emailSlot11 = "", emailSlot12 = "";

    uniqueEmails.forEach(function (item2, i) {
        totalEmails = uniqueEmails.length;
        i++;
        if (i <= 50) {
            emailSlot1 = emailSlot1 + item2 + ", "
        }
        if (i > 50 && i <= 100) {
            emailSlot2 = emailSlot2 + item2 + ", "
        }
        if (i > 100 && i <= 150) {
            emailSlot3 = emailSlot3 + item2 + ", "
        }
        if (i > 150 && i <= 200) {
            emailSlot4 = emailSlot4 + item2 + ", "
        }
        if (i > 200 && i <= 250) {
            emailSlot5 = emailSlot5 + item2 + ", "
        }
        if (i > 250 && i <= 300) {
            emailSlot6 = emailSlot6 + item2 + ", "
        }
        if (i > 300 && i <= 350) {
            emailSlot7 = emailSlot7 + item2 + ", "
        }
        if (i > 350 && i <= 400) {
            emailSlot8 = emailSlot8 + item2 + ", "
        }
        if (i > 400 && i <= 450) {
            emailSlot9 = emailSlot9 + item2 + ", "
        }
        if (i > 450 && i <= 500) {
            emailSlot10 = emailSlot10 + item2 + ", "
        }
        if (i > 500 && i <= 550) {
            emailSlot11 = emailSlot11 + item2 + ", "
        }
        if (i > 550 && i <= 600) {
            emailSlot12 = emailSlot12 + item2 + ", "
        }

    })

    res.status(200).render('email50', { title: "Email Slots 50", totalEmails, emailSlot1, emailSlot2, emailSlot3, emailSlot4, emailSlot5, emailSlot6, emailSlot7, emailSlot8, emailSlot9, emailSlot10, emailSlot11, emailSlot12, duplicates });
}

// ------------------------ GET show single type clg -------------------------
showSingleClgTypeGetCtr = async (req, res) => {
    try {
        // console.log("req.query.type: ", req.query.type);
        const data = await emailDataModel.find({"type": req.query.type}).sort({ "clg_code": 1 });

       
        let arr = [];
        
         data.forEach(function (item1) {
        if (item1.email1 != "") {
            arr.push(item1.email1.trim().toLowerCase())
        }
        if (item1.email2 != "") {
            arr.push(item1.email2.trim().toLowerCase())
        }
        if (item1.email3 != "") {
            arr.push(item1.email3.trim().toLowerCase())
        }

    });
        let uniqueEmails = [...new Set(arr)];
        let duplicates = arr.filter((item, index) => arr.indexOf(item) !== index);  

        uniqueEmailsCount = uniqueEmails.length;
        duplicatesCount = duplicates.length;

        // console.log("uniqueEmails: ", uniqueEmails);
        // console.log("duplicates: ", duplicates);
    
        res.status(200).render("showsingleclgtype", { data, title: "Single College Type",clgType: req.query.type, message: req.flash("message"), uniqueEmailsCount, duplicatesCount });



    } catch (error) {
        console.log("error: ", error.message);
    }
};

module.exports = { showallGetCtr, addClgGetCtr, addClgPostCtr, emailForCopyGetCtr, email50GetCtr, editClgGetCtr, editClgPostCtr, delClgGetCtr, delClgDelCtr, showSingleClgTypeGetCtr, hideClgGetCtr, hideClgPostCtr };
