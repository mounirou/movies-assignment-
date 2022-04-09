import { Component, Injectable } from '@angular/core';
import {HttpClientModule, HttpClient} from '@angular/common/http'
import { Movies } from '../app/models/Movies.model';
import { Person } from '../app/models/Person.model';

@Injectable()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  users: Person[] = [];
  myFriends= new Array();
  allFriendsMovies = new Array();
  popularMovies = "";
  result = false;
  friend = "";
  
  movies = [
    {
      id:1,
      name: "movies 01"
    },{
      id:2,
      name: "movies 02"
    },{
      id:3,
      name: "movies 03"
    },{
      id:4,
      name: "movies 04"
    },{
      id:5,
      name: "movies 05"
    },
  ];

  person = [
    {
      id:1,
      name: "nirou",
      friend: [2,3],
      movies: [1,2]
    },
    {
      id:2,
      name: "friend 01",
      friend: [3,4,5],
      movies: [2,3]
    },
    {
      id:3,
      name: "friend 02",
      friend: [6],
      movies: [4,1]
    },
    {
      id:4,
      name: "friend 03",
      friend: [],
      movies: [1,3]
    },
    {
      id:5,
      name: "friend 04",
      friend: [],
      movies: [1,2,5]
    },
    {
      id:6,
      name: "friend 05",
      friend: [],
      movies: [2,4,5]
    },
    {
      id:7,
      name: "friend 06",
      friend: [],
      movies: [2,1]
    }
  ];

  constructor(private httpClient: HttpClient){}

  ngOnInit(): void {
    //load saved person
    this.getPerson();
  }

  //for save persons to database
  savePerson(){
    this.httpClient.put('https://dev-movies-16681-default-rtdb.europe-west1.firebasedatabase.app/person.json', this.person)
    .subscribe(
      ()=>{
        console.log('enregistrement de personne ! ');
      },
      (error)=>{
        console.log('erreur de sauvegarde :' + error)
      }
    );
  }

  //for save movies to database
  saveMovies(){
    this.httpClient.put('https://dev-movies-16681-default-rtdb.europe-west1.firebasedatabase.app/movies.json', this.movies)
    .subscribe(
      ()=>{
        console.log('enregistrement de films ! ');
      },
      (error)=>{
        console.log('erreur de sauvegarde :' + error)
      }
    );

  }

  //get person from database
  getPerson(){
    this.httpClient.get<any>('https://dev-movies-16681-default-rtdb.europe-west1.firebasedatabase.app/person.json')
    .subscribe(
      (response)=>{
        this.users = response;
        // console.log(this.users);
        let id = this.users.map(el => el.id);
        for(let i=0;i<this.users[0].friend.length;i++){
          if(id.includes(this.users[0].friend[i])){
            let index = id.indexOf(this.users[0].friend[i]);
            // console.log(index);
            this.myFriends.push(index);
          }
        }
      },
      (error)=>{
        console.log('erreur :' + error)
      }
    );
  }

  //get movies from database
  getMovies(){
    this.httpClient.get<any>('https://dev-movies-16681-default-rtdb.europe-west1.firebasedatabase.app/movies.json')
    .subscribe(
      (response)=>{
        console.log(response);
      },
      (error)=>{
        console.log('erreur:' + error)
      }
    );
  }

  //search a popular movies of friend network
  search(i: number){
    this.friend = this.users[i].name;
    this.allFriendsMovies = [];
    this.allFriendsMovies = this.users[i].movies;
    let friendLevel02 = this.users[i].friend;
    let id = this.users.map(el => el.id);
    for(let i=0;i<friendLevel02.length;i++){
        let index = id.indexOf(friendLevel02[i]);
        this.allFriendsMovies = this.allFriendsMovies.concat(this.users[index].movies);
      }
    console.log(this.allFriendsMovies);
    this.getPopularMovies();
  }

  //get a popular movies of friend network
  getPopularMovies(){
    let repeter = 1;
    let counter = 0;
    let id;
    let ids;
    let index;
    for (var i=0; i<this.allFriendsMovies.length; i++)
    {
      for (var j=i; j<this.allFriendsMovies.length; j++)
      {
        if (this.allFriendsMovies[i] == this.allFriendsMovies[j])
        counter++;
        if (repeter<counter)
        {
          repeter=counter; 
          id = this.allFriendsMovies[i];
        }
      }
      counter=0;
    }

    ids = this.users.map(el => el.id);
    index = ids.indexOf(id);

    this.popularMovies = this.movies[index].name;
    this.result = true;
    console.log('The most popular movies is: '+this.popularMovies);
  }

  //go back
  return(){
    this.popularMovies = "";
    this.result = false;
  }

}
