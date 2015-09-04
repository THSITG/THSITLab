/*
 * This files contains methods to read and manipulate user information.
 * We might need to support multiple databases, so it's better to generalize the interface.
 */

module.exports.login = function(name, passwd) {
  // TODO: fill real logic here
  if(name == "CircuitCoder" && passwd == "cctest") 
    return {
      featuredImgUrl: "/images/test-background.jpg",
      avatarUrl: "/images/test-avatar.jpg",
      email: "circuitcoder0@gmail.com",
      name: "刘晓义",
      projects: [
        {
          name: "THSCSLab-Home",
          url: "lab",
          logo: "school"
        },
        {
          name: "Optime",
          url: "optime",
          logo: "timer"
        }
      ]
    };
  else return null;
}

module.exports.digest = function(user) {
  return user;
}

module.exports.getId = function(user) {
  return 0;
}
