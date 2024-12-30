document.getElementById("checkButton").addEventListener("click", async () => {
    const uniqnames = document.getElementById("uniqnames").value.split("\n").map(name => name.trim()).filter(Boolean);

    const resultElement = document.getElementById("result");
    //clear old results when button is pressed
    resultElement.innerText = "";
    resultElement.style.display = "none";

    if (uniqnames.length === 0) {
      resultElement.innerText = "Please enter at least one uniqname.";
      resultElement.style.display = "block";
      return;
    }

    resultElement.innerText = "Loading...";
    resultElement.style.display = "block";
    const { rossCount, notFound } = await checkRossAffiliation(uniqnames);
    const percentage = ((rossCount / uniqnames.length) * 100).toFixed(2);

    if (notFound.length > 0) {
      resultElement.innerText = `\nThe following uniqnames do not exist: ${notFound.join(", ")}`;
    }
    else {
      resultElement.innerText = `${percentage}% of the input list are Ross-affiliated.`;
    }
    resultElement.style.display = "block";
  });
  
  async function checkRossAffiliation(uniqnames) {
    let rossCount = 0;
    const notFound = [];
  
    for (const uniqname of uniqnames) {
      try {
          const isRossAffiliated = await fetchRossData(uniqname);
          if (isRossAffiliated === null) {
              notFound.push(uniqname);
          } else if (isRossAffiliated) {
              rossCount++;
          }
      } catch (error) {
          console.error(`Error processing ${uniqname}: ${error.message}`);
      }
  }

  return { rossCount, notFound };
}

  async function fetchRossData(uniqname) {
    try {
      const response = await fetch(`https://mcommunity.umich.edu/api/people/${uniqname}/`);
      if (response.status === 404) {
        console.warn(`User not found: ${uniqname}.`);
        return null; // Indicate the uniqname does not exist
      }
      
      const data = await response.json();
  
      if (data.ou && Array.isArray(data.ou)) {
        // Look for "ross" or "bba" or "business" in "ou" category
        return data.ou.some(affiliation =>
            affiliation.toLowerCase().includes("ross") ||
            affiliation.toLowerCase().includes("bba") ||
            affiliation.toLowerCase().includes("business")
        );
      }
      return false;
    } catch (error) {
      console.error(`Error fetching data for ${uniqname}:`, error);
      return false;
    }
  }
  