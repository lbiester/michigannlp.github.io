$(document).ready(function() {
    var pageCategory = $('meta[name=category]').attr("content");

    //Dynamically load recent news
     $.ajax({
        type: "GET",
        url: "../data/publications.csv",
        dataType: "text",
        success: function(data) {processDownloads(data,pageCategory);}
    });
});

function processDownloads(allText,pageCategory) {
    arrData = parseCsv(allText);
    
    var categories = []; //each category has a name and a list of publications

    for (var i=1; i<arrData.length; i++) {
        var data = arrData[i];
        
        var publication = {title:data[1], authors:data[2], publication:data[3], link:data[4], category:data[5], demo:data[6], data:data[7], software:data[8], pageCategory:data[9], download:data[10], downloadName:data[11], downloadDescription:data[12], downloadLink:data[13], downloadDate:data[14]};
        
        var allCats = publication.pageCategory.split(',');
        var found = 0;
        //Is the document category in this array?
        for(var j=0; j<allCats.length; j++) {
            if(allCats[j][0]==' ') {
                allCats[j] = allCats[j].substr(1);
            }
            if(pageCategory==allCats[j]) {
                found = 1;
                break;
            }
        }
        if(found==1 && publication.download=='TRUE') {
            var allCategories = publication.category.split(', ');
            for(var j=0; j<allCategories.length; ++j) {
                //is this category already in the categories array?
                var categoryFound = false;
                for(var k=0; k<categories.length; ++k) {
                    if(categories[k].name == allCategories[j]) {
                        categories[k].publications.push(publication);
                        categoryFound = true;
                    }
                }
                if(!categoryFound) {
                    category = {name:allCategories[j], publications:[publication]}
                    categories.push(category);
                }
            }
        }
    }
    
    categories.sort();
    
    //Outline at the top of the page
    for(var i=0; i<categories.length; ++i) {
        categories[i].publications.sort();
        
        if(i==0) {
            $('#downloads-outline').append('<p class="lead-nomargin"><b>'+categories[i].name+'</b></p>');
        } else {
            $('#downloads-outline').append('<p id="top-margin" class="lead-nomargin"><b>'+categories[i].name+'</b></p>');
        }
        for(var j=0; j<categories[i].publications.length; ++j) {
            publication = categories[i].publications[j];
            $('#downloads-outline').append('<p class="lead-nomargin"><a href="#' + publication.downloadName + '">' + publication.downloadName + '</a></p>');
        }
    }
    
    //All of the download information
    for(var i=0; i<categories.length; ++i) {
        $('#all-downloads').append('<h2 class="featurette-heading">' + categories[i].name + '</h2>');
        
        for(var j=0; j<categories[i].publications.length; ++j) {
            publication = categories[i].publications[j];
            
            entry = '';
            alert(j)
            if(j % 2 == 0) {
                if(j != 0) {
                    alert("end row");
                    entry = entry + '</div>'; //end of row
                }
                alert("start row");
                entry = entry + '<div class="row">'; //start of row
            }
            alert(publication.downloadName);
            entry = entry + '<div class="col-sm-6"><div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">' + publication.downloadName + '</h3></div><div class="panel-body">';
            entry = entry + '<p class="lead">' + publication.downloadDescription;
            if(publication.downloadLink) {
                entry = entry + ' (<a href="' + publication.downloadLink + '" target="_blank">download</a>)';
            }
            entry = entry + '</p>';
            entry = entry + '</div></div></div>';
            
            $('#all-downloads').append(entry);
        }
        
        alert("end row final");
        $('#all-downloads').append('</div>'); //close row div
    }
}