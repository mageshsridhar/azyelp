//var all_reviews = {};
//var reviews = [];

Array.prototype.byCount = function(){
  var itm,a =[],L=this.length,o={};
  for(var i =0;i<L;i++){
    itm=this[i];
    if(!itm)continue;
    if(o[itm] == undefined) o[itm] =1;
    else ++o[itm];

  }
  for (var p in o) a[a.length] =p;
  return a.sort(function(a,b){
    return o[b]-o[a];
  });
}

function filter_reviews(businessid){
  reviews = [];
  positive=[];
  negative =[];
  neutral =[];
  positive_reviews =0;
  negative_reviews=0;
  neutral_reviews = 0;
  var url = "https://raw.githubusercontent.com/chetan015/yelp-data-viz/master/tempeReview.json";
  d3.json(url)
  .then(data => countryNames = data)
  .then(function(data) {
  console.log(data);
  reviews_dict = data.filter(function(d){ return d.business_id == businessid });
  console.log(reviews_dict);
  reviews = extract_reviews(reviews_dict);
  positive,negative,neutral,positive_reviews,negative_reviews,neutral_reviews = get_sentiment(reviews);
  create_pie(positive_reviews,negative_reviews,neutral_reviews);
  positive = positive.byCount();
  negative = negative.byCount();
  document.getElementById('best_superb_amazing_very_good_').innerHTML = positive.slice(0,5).join('<br>');
  document.getElementById('bad_awful_worst_not_recommende').innerHTML = negative.slice(0,5).join('<br>');
  pos = (positive_reviews/(negative_reviews+positive_reviews+neutral_reviews)*100);
  neg = (negative_reviews/(negative_reviews+positive_reviews+neutral_reviews)*100);
  neu = (neutral_reviews/(negative_reviews+positive_reviews+neutral_reviews)*100);
  document.getElementById('Positive').innerHTML = ("Positive: "+(pos.toFixed(2))+"%");
  document.getElementById('Negative').innerHTML = ("Negative: "+(neg.toFixed(2))+"%");
  document.getElementById('Neutral').innerHTML = ("Neutral: "+(neu.toFixed(2))+"%");

});
}

function get_sentiment(reviews){
  positive = [];
  negative =[];
  neutral = [];
  positive_reviews = 0;
  negative_reviews =0;
  neutral_reviews =0;
  for(i=0;i<reviews.length;i++){
    lines = reviews[i].split(".");
    //console.log(lines);
    result = sentiment(lines[0]);
    positive.push.apply(positive,result['positive']);
    negative.push.apply(negative,result['negative']);
    neutral.push.apply(neutral,result['neutral']);

    if (result['verdict'] == "POSITIVE"){
      positive_reviews += 1;
    }
    if (result['verdict'] == "NEGATIVE"){
      negative_reviews += 1;
    }
    if (result['verdict'] == "NEUTRAL"){
      neutral_reviews += 1;
    }
  }
  console.log(positive_reviews);
  console.log(negative_reviews);
  console.log(neutral_reviews);
  console.log(positive);
  console.log(negative);
  console.log(neutral);
  return positive,negative,neutral,positive_reviews,negative_reviews,neutral_reviews;

}

function tokenize(input) {
  // convert negative contractions into negate_<word>
  return $.map(input.replace('.', '')
    .replace('/ {2,}/', ' ')
    .replace(/[.,\/#!$%\^&\*;:{}=_`~()]/g, '')
    .toLowerCase()
    .replace(/\w+['’]t\s+(a\s+)?(.*?)/g, 'negate_$2')
    .split(' '), $.trim);
}

function sentiment(phrase) {
  //console.log(phrase);
//stopwords = ['i','me','my','myself','we','our','ours','ourselves','you','your','yours','yourself','yourselves','he','him','his','himself','she','her','hers','herself','it','its','itself','they','them','their','theirs','themselves','what','which','who','whom','this','that','these','those','am','is','are','was','were','be','been','being','have','has','had','having','do','does','did','doing','a','an','the','and','but','if','or','because','as','until','while','of','at','by','for','with','about','against','between','into','through','during','before','after','above','below','to','from','up','down','in','out','on','off','over','under','again','further','then','once','here','there','when','where','why','how','all','any','both','each','few','more','most','other','some','such','no','nor','not','only','own','same','so','than','too','very','s','t','can','will','just','don','should','now'];
  var stopwords = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any","are","aren't","as","at","be","because","been","before","being","below","between","both","but","by","can't","cannot","could","couldn't","did","didn't","do","does","doesn't","doing","don't","down","during","each","few","for","from","further","had","hadn't","has","hasn't","have","haven't","having","he","he'd","he'll","he's","her","here","here's","hers","herself","him","himself","his","how","how's","i","i'd","i'll","i'm","i've","if","in","into","is","isn't","it","it's","its","itself","let's","me","more","most","mustn't","my","myself","no","nor","not","of","off","on","once","only","or","other","ought","our","ours","ourselves","out","over","own","same","shan't","she","she'd","she'll","she's","should","shouldn't","so","some","such","than","that","that's","the","their","theirs","them","themselves","then","there","there's","these","they","they'd","they'll","they're","they've","this","those","through","to","too","under","until","up","very","was","wasn't","we","we'd","we'll","we're","we've","were","weren't","what","what's","when","when's","where","where's","which","while","who","who's","whom","why","why's","with","won't","would","wouldn't","you","you'd","you'll","you're","you've","your","yours","yourself","yourselves"];
  var tokens = tokenize(phrase),
    score = 0,
    words = [],
    positive = [],
    negative = [];
    neutral = []; 
  console.log(tokens);

  // Iterate over tokens
  var len = tokens.length;
  while (len--) {
    var obj = tokens[len];
    var negate = obj.startsWith('negate_');

    if (negate) obj = obj.slice("negate_".length);
    console.log(stopwords.includes(obj));
    if (stopwords.includes(obj) == true){
      console.log("in here");
      continue;
    }
    var obj_stemmed = stemmer(obj);
    console.log(obj);
    console.log(obj_stemmed);

    if (!afinn.hasOwnProperty(obj_stemmed)) continue;

    var item = afinn[obj_stemmed];
    //console.log(item);

    words.push(obj_stemmed);
    if (negate) item = item * -1.0;
    if (item > 0) positive.push(obj_stemmed);
    if (item < 0) negative.push(obj_stemmed);
    if(item == 0) neutral.push(obj_stemmed);

    score += parseInt(item);
  }

  var verdict = score == 0 ? "NEUTRAL" : score < 0 ? "NEGATIVE" : "POSITIVE";

  var result = {
    verdict: verdict,
    score: score,
    comparative: score / tokens.length,
    positive: [...new Set(positive)],
    negative: [...new Set(negative)],
    neutral: [...new Set(neutral)]
  };

  return result;
}

function create_pie(positive_reviews,negative_reviews,neutral_reviews){
  // set the dimensions and margins of the graph
var width = 300
    height = 300
    margin = 40

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(width, height) / 2 - margin

// append the svg object to the div called 'my_dataviz'
var svg = d3.select("#Ring_Chart11")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// Create dummy data
var data = {positive: positive_reviews, negative:negative_reviews , neutral:neutral_reviews}
console.log(data);
// set the color scale
var color = d3.scaleOrdinal()
  .domain(data)
  .range(["#00EBC8", "#FF5470", "#6C63FF"])

// Compute the position of each group on the pie:
var pie = d3.pie()
  .value(function(d) {return d.value; })
var data_ready = pie(d3.entries(data))

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
svg
  .selectAll('whatever')
  .data(data_ready)
  .enter()
  .append('path')
  .attr('d', d3.arc()
    .innerRadius(50)         // This is the size of the donut hole
    .outerRadius(radius)
  )
  .attr('fill', function(d){ return(color(d.data.key)); })
  .append('text')
  .text( function(d) { return d.data.value; } )
  //.attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
  .style("text-anchor", "middle")
  .style("font-size", 17)
  //.attr("stroke", "black")
  //.style("stroke-width", "2px")
  //.style("opacity", 0.7)
}



function extract_reviews(dict){
  reviews = dict.map(d => d.text);
  //console.log(reviews);
  return reviews;
}

var stemmer = (function(){
var step2list = {
        "ational" : "ate",
        "tional" : "tion",
        "enci" : "ence",
        "anci" : "ance",
        "izer" : "ize",
        "bli" : "ble",
        "alli" : "al",
        "entli" : "ent",
        "eli" : "e",
        "ousli" : "ous",
        "ization" : "ize",
        "ation" : "ate",
        "ator" : "ate",
        "alism" : "al",
        "iveness" : "ive",
        "fulness" : "ful",
        "ousness" : "ous",
        "aliti" : "al",
        "iviti" : "ive",
        "biliti" : "ble",
        "logi" : "log"
    },

    step3list = {
        "icate" : "ic",
        "ative" : "",
        "alize" : "al",
        "iciti" : "ic",
        "ical" : "ic",
        "ful" : "",
        "ness" : ""
    },

    c = "[^aeiou]",          // consonant
    v = "[aeiouy]",          // vowel
    C = c + "[^aeiouy]*",    // consonant sequence
    V = v + "[aeiou]*",      // vowel sequence

    mgr0 = "^(" + C + ")?" + V + C,               // [C]VC... is m>0
    meq1 = "^(" + C + ")?" + V + C + "(" + V + ")?$",  // [C]VC[V] is m=1
    mgr1 = "^(" + C + ")?" + V + C + V + C,       // [C]VCVC... is m>1
    s_v = "^(" + C + ")?" + v;                   // vowel in stem

return function (w) {
    var     stem,
        suffix,
        firstch,
        re,
        re2,
        re3,
        re4,
        origword = w;

    if (w.length < 3) { return w; }

    firstch = w.substr(0,1);
    if (firstch == "y") {
        w = firstch.toUpperCase() + w.substr(1);
    }

    // Step 1a
    re = /^(.+?)(ss|i)es$/;
    re2 = /^(.+?)([^s])s$/;

    if (re.test(w)) { w = w.replace(re,"$1$2"); }
    else if (re2.test(w)) { w = w.replace(re2,"$1$2"); }

    // Step 1b
    re = /^(.+?)eed$/;
    re2 = /^(.+?)(ed|ing)$/;
    if (re.test(w)) {
        var fp = re.exec(w);
        re = new RegExp(mgr0);
        if (re.test(fp[1])) {
            re = /.$/;
            w = w.replace(re,"");
        }
    } else if (re2.test(w)) {
        var fp = re2.exec(w);
        stem = fp[1];
        re2 = new RegExp(s_v);
        if (re2.test(stem)) {
            w = stem;
            re2 = /(at|bl|iz)$/;
            re3 = new RegExp("([^aeiouylsz])\\1$");
            re4 = new RegExp("^" + C + v + "[^aeiouwxy]$");
            if (re2.test(w)) {  w = w + "e"; }
            else if (re3.test(w)) { re = /.$/; w = w.replace(re,""); }
            else if (re4.test(w)) { w = w + "e"; }
        }
    }

    // Step 1c
    re = /^(.+?)y$/;
    if (re.test(w)) {
        var fp = re.exec(w);
        stem = fp[1];
        re = new RegExp(s_v);
        if (re.test(stem)) { w = stem + "i"; }
    }

    // Step 2
    re = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;
    if (re.test(w)) {
        var fp = re.exec(w);
        stem = fp[1];
        suffix = fp[2];
        re = new RegExp(mgr0);
        if (re.test(stem)) {
            w = stem + step2list[suffix];
        }
    }

    // Step 3
    re = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;
    if (re.test(w)) {
        var fp = re.exec(w);
        stem = fp[1];
        suffix = fp[2];
        re = new RegExp(mgr0);
        if (re.test(stem)) {
            w = stem + step3list[suffix];
        }
    }

    // Step 4
    re = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
    re2 = /^(.+?)(s|t)(ion)$/;
    if (re.test(w)) {
        var fp = re.exec(w);
        stem = fp[1];
        re = new RegExp(mgr1);
        if (re.test(stem)) {
            w = stem;
        }
    } else if (re2.test(w)) {
        var fp = re2.exec(w);
        stem = fp[1] + fp[2];
        re2 = new RegExp(mgr1);
        if (re2.test(stem)) {
            w = stem;
        }
    }

    // Step 5
    re = /^(.+?)e$/;
    if (re.test(w)) {
        var fp = re.exec(w);
        stem = fp[1];
        re = new RegExp(mgr1);
        re2 = new RegExp(meq1);
        re3 = new RegExp("^" + C + v + "[^aeiouwxy]$");
        if (re.test(stem) || (re2.test(stem) && !(re3.test(stem)))) {
            w = stem;
        }
    }

    re = /ll$/;
    re2 = new RegExp(mgr1);
    if (re.test(w) && re2.test(w)) {
        re = /.$/;
        w = w.replace(re,"");
    }

    // and turn initial Y back to y

    if (firstch == "y") {
        w = firstch.toLowerCase() + w.substr(1);
    }

    return w;
}
})();
