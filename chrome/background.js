/**
* Extension main event handler.
*
**/


// Register pageAction activate only when user visits wikipedia.org site
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


/**
# Helper function to add the `simple` keyword into the 
# wikipedia url.
# 
# Example:
#  input(String)  -> https://en.wikipedia.org/wiki/Kinetic_energy
#  output(String) -> https://simple.wikipedia.org/wiki/Kinetic_energy
**/
function simplify_wikipedia(url){

	const WORDS_ALLOWED_IN_HOSTNAME = ["wikipedia", "org"]

	let parsed_url_object = new URL(url)

	// split the url hostname into an array and create a new array without the words that are not in the `WORDS_ALLOWED_IN_HOSTNAME` list
	const splitted_hostname = parsed_url_object.hostname.split('.')
	let filtered_splitted_hostname = splitted_hostname.filter(splitted_words => WORDS_ALLOWED_IN_HOSTNAME.some(allowed_word => splitted_words.includes(allowed_word)))
	
	// add `simple` word into the splitted hostname as the first item
	filtered_splitted_hostname = ["simple", ...filtered_splitted_hostname]

	// replace old hostname from url object with the filtered one
	const filtered_hostname_string = filtered_splitted_hostname.join('.')
	parsed_url_object.hostname = filtered_hostname_string

	return parsed_url_object.href

}


chrome.pageAction.onClicked.addListener( tab => {
	console.log('page_action clicked..', tab)

	console.log(`Url to be simplified: ${tab.url}`)
	const simplified_url = simplify_wikipedia(tab.url)
	console.log(`simplified url: ${simplified_url}`)
	
	// reload the tab with the new url
	chrome.tabs.update(tab.id, {url: simplified_url})
	
	
});

/**
* A simple helper function to test the wikipedia url simplify function.
* It goes over each test usecase and throws an assertion error if any usecase fails, alongside some metadata to ID the culprit.
**/
function test_simplify_wikipedia(){
	const usecase_list = [
		{ 
			'input': 'https://en.wikipedia.org/wiki/Kinetic_energy', 
			'expected_output': 'https://simple.wikipedia.org/wiki/Kinetic_energy'
		},
		{ 
			'input': 'https://en.wikipedia.org/wiki/Albert_Einstein', 
			'expected_output': 'https://simple.wikipedia.org/wiki/Albert_Einstein'
		},
		{ 
			'input': 'https://simple.wikipedia.org/wiki/Albert_Einstein', 
			'expected_output': 'https://simple.wikipedia.org/wiki/Albert_Einstein'
		}
	]

	usecase_list.map(usecase => {
		console.log(`testing usecase for url: ${usecase.input}`)
		output = simplify_wikipedia(usecase.input)
		// assertion and returns a context object in case of assertion error
		console.assert(usecase.expected_output == output, {test_usecase:usecase, output: output})
	})
}













