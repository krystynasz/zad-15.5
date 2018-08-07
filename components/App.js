App = React.createClass({
    getInitialState() {
        return {
            loading: false,
            searchingText: '',
            gif: {}
        };
    },
    handleSearch: function (searchingText) {
        this.setState({
            loading: true
        });
        this.getGif(searchingText)
        .then(gif => {console.log("The gif was found at: "+ gif.sourceUrl);
                    this.setState({
                        loading: false,
                        gif: gif,
                        searchingText: searchingText
                    });
                    }
            )
        .catch(error => console.error(error));
    },
    getGif: function (searchingText) {
        return new Promise(
            function (resolve, reject) {
                var GIPHY_API_URL = 'http://api.giphy.com';
                var GIPHY_PUB_KEY = 'bD0WwE93mSXQj0Fbdi6E5zPW4Fp5WwyE';
                var url = GIPHY_API_URL + '/v1/gifs/random?api_key=' + GIPHY_PUB_KEY + '&tag=' + searchingText;
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url);
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        var data = JSON.parse(xhr.responseText).data;
                        var gif = {
                            url: data.fixed_width_downsampled_url,
                            sourceUrl: data.url
                        };
                        resolve(gif);
                    } else {
                        reject(Error('Image didn\'t load successfully. Error code: ' + xhr.statusText));
                    }
                };
                xhr.onerror = function () {
                    reject(Error('There was a network error.'));
                };
                xhr.send();
            });
    },
    render: function () {
        var styles = {
            margin: '0 auto',
            textAlign: 'center',
            width: '90%'
        };
        return (
            <div style={styles}>
                <h1>GIF SEARCHER</h1>
                <p>Find a gif at <a href='http://giphy.com'>giphy</a>. Click enter to download the next gif.</p>
                <Search
                    onSearch={this.handleSearch}
                />
                <Gif
                    loading={this.state.loading}
                    url={this.state.gif.url}
                    sourceUrl={this.state.gif.sourceUrl}
                />
            </div>
        );
    }
});