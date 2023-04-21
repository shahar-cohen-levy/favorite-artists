=== Favorite artists ===
Contributors: Shahar Cohen
Tags: spotify
Requires at least: 4.9
Tested up to: 6.1.1
Requires PHP: 5.6
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Add your favorite artists to shwowcase them on your blog.

== User story ==

As an administrator, I want to use a search field to type an artist name, so that I could find a matching artist and add it to a list.

= Acceptance criteria =

* The search field is placed in a settings page.
* Search starts once the user clicks “Search”
* Search is performed if a user types in a partial or full text of an artist.
* Search is in English, Spanish, and German
* Suggested result will appear below the search field, with a text asking the user if they want to add the artist.
* If they choose ‘Yes’ it will be added to the list.
* If they choose ‘No, I want to search again’ the search field will get reseted.


== How to Use ==

**Install and enable the plugin**

FROM THE PLUGINS DIRECTORY IN WORDPRESS ADMIN

* Place this folder in Wordpress's plugins folder
* Find 'Favorite Artists' in the plugin list.
* Click “Install” on the Font Awesome plugin in the search results
* Click “Activate”

**Set Spotify's API credentials**

* Get client ID & Secret from https://developer.spotify.com/documentation/web-api/tutorials/getting-started#create-an-app.
* Go to Settings > Favorite Artists > API Settings
* Enter client ID & Secret and submit.