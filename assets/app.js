  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCvXGt76A60lAy7Eux5cq_4SNcN7Txswtg",
    authDomain: "train-project-53630.firebaseapp.com",
    databaseURL: "https://train-project-53630.firebaseio.com",
    projectId: "train-project-53630",
    storageBucket: "train-project-53630.appspot.com",
    messagingSenderId: "362769386102"
  };
  firebase.initializeApp(config);
  var database = firebase.database();

  $(`#add-train-btn`).click(function (event) {
      event.preventDefault();

      var train = $(`#train-name-input`).val().trim();
      var destination = $(`#destination-input`).val().trim();
      var firstTrainTime = moment($(`#first-train-time-input`).val().trim(), "hh:mm").subtract(10, "years").format("X");
      var trainFrequency = $(`#train-frequency`).val().trim();

      var newTrain = {
          train: train,
          destination: destination,
          firstTrainTime: firstTrainTime,
          trainFrequency: trainFrequency
      };

      database.ref().push(newTrain);

      train = $(`#train-name-input`).val("");
      destination = $(`#destination-input`).val("");
      firstTrainTime = $(`#first-train-time-input`).val("");
      trainFrequency = $(`#train-frequency`).val("");
  });

  database.ref().on("child_added", function (childSnapshot) {

      var train = childSnapshot.val().train;
      var destination = childSnapshot.val().destination;
      var trainFrequency = childSnapshot.val().trainFrequency;
      var firstTrainTime = childSnapshot.val().firstTrainTime;
      
      var timeRemainder = moment().diff(moment.unix(firstTrainTime), "minutes") % trainFrequency;
      var minutesAway = trainFrequency - timeRemainder;
      var nextTrainArrival = moment().add(minutesAway, "m").format("hh:mm A"); 


      var newTr = {
          train: train,
          destination: destination,
          trainFrequency: trainFrequency,
          firstTrainTime: firstTrainTime,
          nextTrainArrival: nextTrainArrival, 
          minutesAway: minutesAway
      };

      $("tbody").prepend(makeRow(newTr));

  })

  // template literal for row data
  function makeRow(data) {
      return `
        <tr>
            <td>${data.train}</td>
            <td>${data.destination}</td>
            <td>${data.trainFrequency}</td>
            <td>${data.nextTrainArrival}</td>
            <td>${data.minutesAway}</td>
        </tr>
      `
  }