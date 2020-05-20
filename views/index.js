const layout = require('./layout');

module.exports = () => {
	return layout({
		content: `
        <div>
            <form method="POST">
                <h1>Search your Flight by entering time</h1>
                <input type="time" name="flightTime" />
                <button>Search</button>
            </form>
        </div>`
	});
};
