angular.module('libraryApp')
  .service('BooksService', BooksService);

BooksService.$inject = ['$http', '$q'];
function BooksService($http, $q) {
  console.log('service');
  var self = this;  // similar to vm = this, but we're not working with a view-model here so using the 'generic' form for this closure
  self.books = [];  // we'll let getAll fill this in when it can
  self.getAll = getAll;
  self.erase = erase;

  function getAll() {
    console.log('someone requested all the books');

    var def = $q.defer();  // create a new 'deferred'

    $http({
      method: 'GET',
      url: 'https://super-crud.herokuapp.com/books'
    }).then(onBooksIndexSuccess, onError)

    // we return the promise here - whenever it's complete any other .then's you attach will get run too
    return def.promise;

    // note how these are defined within the body of getAll?  this gives them access to variables in getAll (closure)
    function onBooksIndexSuccess(response){
      console.log('here\'s the get all books response data from the service', response.data);
      self.books = response.data.books;
      // ok, we got data, resolve the deferred
      def.resolve(response.data);
    }
    function onError(error){
      console.log('there was an error: ', error);
      self.books.error = {error: error};
      def.reject("Failed: ", error);
    }
  }


  function erase() {
    console.log('this.books', this.books);
    this.books.splice(1,1);
  }

}
