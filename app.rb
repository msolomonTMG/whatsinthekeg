require 'sinatra'
require 'rest-client'
require 'json'

get '/' do
	erb :index
end

get '/api/v1/beers/on_tap' do
	url = 'http://sheetsu.com/apis/9e91808a'
	data = JSON.parse( RestClient.get(url) )
	beers = data['result']
	beers_on_tap = Array.new

	beers.each do |beer|
		if beer['On Tap'] === "TRUE"
			beers_on_tap.push(beer)
		end
	end
	content_type :json
  	{ :beers => beers_on_tap }.to_json
end

get '/api/v1/beers' do
	url = 'http://sheetsu.com/apis/9e91808a'
	data = JSON.parse( RestClient.get(url) )
	beers = data['result']

	content_type :json
  	{ :beers => beers }.to_json
end