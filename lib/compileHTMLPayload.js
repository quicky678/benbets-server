const compileHTMLPayload = (predictionsData) => {
  let payload = "";

  predictionsData.forEach((prediction) => {
    const { league, home_team, away_team, html_response } = prediction;
    let predictionText = ``;
    const leagueHeader = `<h1>League: ${league}</h1>`;
    const fixtureSubheading = `<h2>Fixture: ${home_team} Vs ${away_team}</h2>`;
    const predictionSection = `<div>${html_response}</div><br/><br/>`;
    predictionText = `${leagueHeader}${fixtureSubheading}${predictionSection}`;
    payload += predictionText;
  });

  return payload;
};

module.exports = compileHTMLPayload;
