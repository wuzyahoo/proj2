const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function() {
    try {
      await this.initWeb3();

      // get contract instance
      $.getJSON('../../build/contracts/StarNotary.json', function(data) {
        App.initAccount(data);
      });
    } catch (error) {
      console.error("Could not connect to contract or chain." + error);
    }
  },

  initWeb3: async function() {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        const provider = await detectEthereumProvider();
      }
      catch (error) {
        console.error("user denied account access" + error);
      }
    }
    else if (window.web3) { // legacy
      App.web3Provider = window.web3.currentProvider;
    }
    else {
      App.web3Provider = new Web3.providers.HttpProvider("http://localhost:9545");
    }
    web3 = new Web3(App.web3Provider);
  },

  initAccount : async function(starNotaryArtifact) {
    App.meta = TruffleContract(starNotaryArtifact);
    App.meta.setProvider(App.web3Provider);

    web3.eth.getAccounts(function(error, accounts) {
      if (error)
        console.log(error);

      account = accounts[0];
    });
  },

  setStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },

  createStar: async function() {
    App.meta.deployed().then(async function(inst) {
      const name = document.getElementById("starName").value;
      const id = document.getElementById("starId").value;
      await inst.createStar(name, id, {from: this.account});
      App.setStatus("New Star Owner is " + this.account);
    });
  },

  // Implement Task 4 Modify the front end of the DAPP
  lookUp: async function (){
    App.meta.deployed().then(async function(inst) {
      const id = document.getElementById("starId").value;
      const name = await inst.lookUptokenIdToStarInfo(id, {from: this.account});
      App.setStatus("Star name is " + name);
    });
  }
};

window.App = App;

App.start();
