document.getElementById("checkButton").addEventListener("click", async () => {
    const uniqnames = document.getElementById("uniqnames").value.split("\n").map(name => name.trim()).filter(Boolean);
    if (uniqnames.length === 0) {
      document.getElementById("result").innerText = "Please enter at least one uniqname.";
      return;
    }
  
    const rossCount = await checkRossAffiliation(uniqnames);
    const percentage = ((rossCount / uniqnames.length) * 100).toFixed(2);
    document.getElementById("result").innerText = `${percentage}% of the input list are Ross-affiliated.`;
  });
  
  async function checkRossAffiliation(uniqnames) {
    let rossCount = 0;
  
    for (const uniqname of uniqnames) {
      const isRossAffiliated = await fetchRossData(uniqname);
      if (isRossAffiliated) rossCount++;
    }
  
    return rossCount;
  }
  
  async function fetchRossData(uniqname) {
    try {
      const response = await fetch(`https://mcommunity.umich.edu/api/people/${uniqname}/`);
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
  