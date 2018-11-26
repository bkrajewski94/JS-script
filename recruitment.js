const link = 'https://files.gwo.pl/custom/random-data.json';

const additionalProgrammers = [
  {
    name: 'Bob',
    framework: 'React',
    expirience: 8,
    available: true
  },
  {
    name: 'Michael',
    framework: 'Angular',
    expirience: 3,
    available: false
  }
];

const filter = [
  programmer => !programmer.available,
  programmer => programmer.framework === 'React'
];

const RecruitmentAgency = (() => {
  const allProgrammers = new WeakMap();

  return class RecruitmentAgency {
    constructor() {
      allProgrammers.set(this, []);
      this.index = 0;
    }

    getAllProgrammers() {
      return allProgrammers.get(this);
    }

    addProgrammer(newProgrammer) {
      let currentProgrammers = this.getAllProgrammers().concat({
        ...newProgrammer,
        key: this.index
      });

      allProgrammers.set(this, currentProgrammers);
      this.index++;
    }

    deleteProgrammer(object) {
      let currentProgrammers = this.getAllProgrammers().filter(
        element => element.key !== object.key
      );
      allProgrammers.set(this, currentProgrammers);
    }

    getShowcase() {
      let helloMessage = 'Hello. There is a list of avaliable programmers: ';
      const availableProgrammers = this.getAllProgrammers()
        .filter(element => element.available)
        .forEach(
          element => (helloMessage = helloMessage + element.name + ' <br/> ')
        );
      return helloMessage;
    }

    updateProgrammer(object) {
      let currentProgrammers = this.getAllProgrammers().map(programmer => {
        if (programmer.key === object.key) return object;
        return programmer;
      });
      allProgrammers.set(this, currentProgrammers);
    }

    getFilteredProgrammers(filters = []) {
      return this.getAllProgrammers().filter(programmer =>
        filters.every(filter => filter(programmer))
      );
    }
  };
})();

const loadDataToClass = (className, initialData) => {
  initialData.forEach(programmer => className.addProgrammer(programmer));
};

const getDataFromServer = (className, link) =>
  fetch(link)
    .then(response => response.json())
    .then(data => loadDataToClass(className, data));

(async () => {
  //Create class instance and fetch data from server
  const agency = new RecruitmentAgency();
  await getDataFromServer(agency, link);

  //Run getAllProgrammers method
  let allProgrammers = agency.getAllProgrammers();
  console.log(allProgrammers);

  //Run addProgrammer method
  additionalProgrammers.map(programmer => {
    agency.addProgrammer(programmer);
    programmer.key = agency.index - 1;
  });
  console.log(agency.getAllProgrammers());

  //Run deleteProgrammer method
  if (additionalProgrammers.length >= 2) {
    agency.deleteProgrammer(
      additionalProgrammers[additionalProgrammers.length - 1]
    );
    console.log(agency.getAllProgrammers());
  }

  //Run getSchowcase method
  let showcase = agency.getShowcase();
  console.log(showcase);

  //Run updateProgrammer method
  if (additionalProgrammers.length) {
    let changedProgrammer = { ...additionalProgrammers[0] };
    changedProgrammer.available = !changedProgrammer.available;
    agency.updateProgrammer(changedProgrammer);
    console.log(agency.getAllProgrammers());
  }

  //Run getFilteredProgrammers method
  let filtredProgrammers = agency.getFilteredProgrammers(filter);
  console.log(filtredProgrammers);

  //testing
  console.log('Checking if allProgramers is private:');
  console.log(agency.allProgrammers); //undefined
})();
