import { neo4jgraphql } from '../../src/index';

export const typeDefs = `
type Movie {
  movieId: ID!
  title: String
  someprefix_title_with_underscores: String
  year: Int
  dateTime: DateTime
  localDateTime: LocalDateTime
  date: Date
  plot: String
  poster: String
  imdbRating: Float
  ratings: [Rated]
  genres: [Genre] @relation(name: "IN_GENRE", direction: "OUT")
  similar(first: Int = 3, offset: Int = 0, limit: Int = 5): [Movie] @cypher(statement: "WITH {this} AS this MATCH (this)--(:Genre)--(o:Movie) RETURN o ORDER BY o.title LIMIT {limit}")
  mostSimilar: Movie @cypher(statement: "WITH {this} AS this RETURN this")
  degree: Int @cypher(statement: "WITH {this} AS this RETURN SIZE((this)--())")
  actors(first: Int = 3, offset: Int = 0): [Actor] @relation(name: "ACTED_IN", direction:"IN")
  directors(first: Int = 3, offset: Int = 0): [Actor] @relation(name: "DIRECTED", direction:"IN")
  avgStars: Float
  filmedIn: State @relation(name: "FILMED_IN", direction: "OUT")
  scaleRating(scale: Int = 3): Float @cypher(statement: "WITH $this AS this RETURN $scale * this.imdbRating")
  scaleRatingFloat(scale: Float = 1.5): Float @cypher(statement: "WITH $this AS this RETURN $scale * this.imdbRating")
}

type Genre {
  name: String
  movies(first: Int = 3, offset: Int = 0): [Movie] @relation(name: "IN_GENRE", direction: "IN")
  highestRatedMovie: Movie @cypher(statement: "MATCH (m:Movie)-[:IN_GENRE]->(this) RETURN m ORDER BY m.imdbRating DESC LIMIT 1")
}

type State {
  name: String
}

interface Person {
  name: String
}

union Searchable = Actor | Director | Movie

type Actor implements Person {
  name: String
  foo: String
  movies: [Movie] @relation(name: "ACTED_IN", direction: "OUT")
}

type Director implements Person {
  name: String
  bar: String
  movies: [Movie] @relation(name: "DIRECTED", direction: "OUT")
}

type User {
  userId: ID!
  name: String
  rated: [Rated]
}

type Rated @relation(name:"RATED") {
  from: User
  to: Movie
  timestamp: Int
  date: Date
  rating: Float
}
enum BookGenre {
  Mystery,
  Science,
  Math
}

type OnlyDate {
  date: Date
}

type Book {
  genre: BookGenre
}

type Query {
  Movie(movieId: ID, title: String, year: Int, plot: String, poster: String, imdbRating: Float): [Movie]  MoviesByYear(year: Int, first: Int = 10, offset: Int = 0): [Movie]
  AllMovies: [Movie]
  MovieById(movieId: ID!): Movie
  GenresBySubstring(substring: String): [Genre] @cypher(statement: "MATCH (g:Genre) WHERE toLower(g.name) CONTAINS toLower($substring) RETURN g")
  Books: [Book]
  AllPeople(first: Int = 10, offset: Int = 0): [Person]
  Search(query: String!, first: Int = 10, offset: Int = 0): [Searchable] @cypher(statement: "MATCH (s:Searchable) WHERE toLower(s.name) CONTAINS toLower($query) OR toLower(s.title) CONTAINS toLower($query) RETURN s LIMIT $limit OFFSET $offset")
}`;

export const resolvers = {
  // root entry point to GraphQL service
  Query: {
    Movie(object, params, ctx, resolveInfo) {
      return neo4jgraphql(object, params, ctx, resolveInfo, true);
    },
    MoviesByYear(object, params, ctx, resolveInfo) {
      return neo4jgraphql(object, params, ctx, resolveInfo, true);
    },
    AllMovies(object, params, ctx, resolveInfo) {
      return neo4jgraphql(object, params, ctx, resolveInfo, true);
    },
    MovieById(object, params, ctx, resolveInfo) {
      return neo4jgraphql(object, params, ctx, resolveInfo, true);
    },
    GenresBySubstring(object, params, ctx, resolveInfo) {
      return neo4jgraphql(object, params, ctx, resolveInfo, true);
    },
    Books(object, params, ctx, resolveInfo) {
      return neo4jgraphql(object, params, ctx, resolveInfo, true);
    },
    AllPeople(object, params, ctx, resolveInfo) {
      return neo4jgraphql(object, params, ctx, resolveInfo, true);
    }
  }
};

// Mutation: {
//   CreateGenre(object, params, ctx, resolveInfo) {
//     return neo4jgraphql(object, params, ctx, resolveInfo, true);
//   },
//   CreateMovie(object, params, ctx, resolveInfo) {
//     return neo4jgraphql(object, params, ctx, resolveInfo, true);
//   },
//   AddMovieGenre(object, params, ctx, resolveInfo) {
//     return neo4jgraphql(object, params, ctx, resolveInfo, true);
//   }
// }
