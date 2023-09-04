import Body from "../component/Body"



function AboutPage() {
  return (
    <Body navbar footer>
      <div>
        <h1>About rMEND</h1>
        <br />
        <p>
          rMEND is a project I have been passionate about for well over two years, though not until recently have I been able to begin this journey.
        </p>
        <p>rMEND is an application dedicated to allowing users the ability to be able to search across multiple media platforms 
          to let them recommend any media they would like. 
        </p>
        <p>
          Mediums such as Books, Movies, TV Shows, Video Games, Albums, and Podcasts will be available for users to apply.
        </p>
        <p>
          The point of rMEND is to be able to span the medium of medias to find new things you may have never heard of before,
          to see what other people are recommending, to branch out to genres or mediums you may not have found otherwise.
          After having spent so much time into trying to find new movies, shows, and music, especially those interconnected,
          I decided to build an application myself to allow users the freedom to recommend any media for any other media.
        </p>
        <div>
          <p>rMEND uses multiple different third-parties to gather its results.</p>
          <h3>Movies & TV</h3>
            <p>Results from <a href="https://www.themoviedb.org">The Movie Database</a></p>
            <p>This product uses the TMDB API but is not endorsed or certified by TMDB</p>
            <a href="https://www.themoviedb.org">
              <img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg" alt="TMDB Logo" />
            </a>
          <h3>Books</h3>
            <p>this medium is not yet applied</p>
          <h3>Games</h3>
            <p>Resuts from <a href="https://rawg.io/">RAWG</a></p>
            <a href="https://rawg.io/">
              <img src="https://i1.wp.com/operationrainfall.com/wp-content/uploads/2019/06/0.jpg" alt="RAWG Logo" />
            </a>
          <h3>Music</h3>
            <p>this medium is not yet applied</p>
          <h3>Podcast</h3>
          <p>this medium is not yet applied</p>
        </div>
        <p>rMEND is currently a non-commercial project.</p>
      </div>
    </Body>
    
  )
}

export default AboutPage