/**
* Extension main event handler.
**/


chrome.runtime.onInstalled.addListener(function(details) {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
	    {
			conditions: [
				new chrome.declarativeContent.PageStateMatcher({
					pageUrl: { hostContains: 'wikipedia.org', schemes: ['https'] },
				})
	    	],
			actions: [ new chrome.declarativeContent.ShowPageAction() ]
	    },
    ]);
  });
});


function simplify_wikipedia_url(url){

	const WORDS_ALLOWED_IN_HOSTNAME = ["wikipedia", "org"]

	// split the url hostname into an array and create a new array without the words that are not in the `WORDS_ALLOWED_IN_HOSTNAME` list
	const splitted_hostname = url.hostname.split('.')
	let filtered_splitted_hostname = splitted_hostname.filter(splitted_words => WORDS_ALLOWED_IN_HOSTNAME.some(allowed_word => splitted_words.includes(allowed_word)))
	
	// add `simple` word into the splitted hostname as the first item
	filtered_splitted_hostname = ["simple", ...filtered_splitted_hostname]

	// replace old hostname from url object with the filtered one
	const filtered_hostname_string = filtered_splitted_hostname.join('.')
	url.hostname = filtered_hostname_string

	return url.href

}


chrome.pageAction.onClicked.addListener( tab => {
	console.log('page_action clicked..', tab)

	wikipedia_url = new URL(tab.url)
	console.log(wikipedia_url)

	const simplified_url = simplify_wikipedia_url(wikipedia_url)
	console.log(simplified_url)
	
	chrome.tabs.update(tab.id, {url: simplified_url})
	
	
});
