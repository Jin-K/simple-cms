using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace SimpleCRM.Api.Controllers {

	/// <summary>
	/// The main ChatController class
	/// Handles all the routes for chat
	/// 
	/// Contains following routes:
	/// 
	///   GET   chat/chats/     : <see cref="ChatController.GetChats()"></see>
	///   GET   chat/chats/:id  : <see cref="ChatController.GetChat(string)"></see>
	///   POST  chat/chats/:id  : <see cref="ChatController.PostChats(string, dynamic)"></see>
	///   GET   chat/user       : <see cref="ChatController.GetUser()"></see>
	///   POST  chat/user/:id   : <see cref="ChatController.PostUser(string, dynamic)"></see>
	///   GET   chat/contacts   : <see cref="ChatController.GetContacts()"></see>
	///
	/// </summary>
	[Route("api/[controller]")]
	public class ChatController : Controller {

		/// <summary>
		/// TODELETE Fake static db for chat data (null reset on Startup)
		/// </summary>
		internal static dynamic fakeDB = null;

    /// <summary>
    /// Constructor
    /// </summary>
		public ChatController() {
      if (fakeDB != null) return;

      fakeDB = new {
        Contacts = JsonConvert.DeserializeObject<List<dynamic>>( "[{\"id\":\"5725a680b3249760ea21de52\",\"name\":\"AliceFreeman\",\"avatar\":\"assets/images/avatars/alice.jpg\",\"status\":\"online\",\"mood\":\"Loremipsumdolorsitamet,consecteturadipiscingelit.\"},{\"id\":\"5725a680606588342058356d\",\"name\":\"Arnold\",\"avatar\":\"assets/images/avatars/Arnold.jpg\",\"status\":\"do-not-disturb\",\"mood\":\"Loremipsumdolorsitamet,consecteturadipiscingelit.\"},{\"id\":\"5725a68009e20d0a9e9acf2a\",\"name\":\"Barrera\",\"avatar\":\"assets/images/avatars/Barrera.jpg\",\"status\":\"do-not-disturb\",\"mood\":\"Loremipsumdolorsitamet,consecteturadipiscingelit.\",\"unread\":null},{\"id\":\"5725a6809fdd915739187ed5\",\"name\":\"Blair\",\"avatar\":\"assets/images/avatars/Blair.jpg\",\"status\":\"offline\",\"mood\":\"Loremipsumdolorsitamet,consecteturadipiscingelit.\",\"unread\":3},{\"id\":\"5725a68007920cf75051da64\",\"name\":\"Boyle\",\"avatar\":\"assets/images/avatars/Boyle.jpg\",\"status\":\"offline\",\"mood\":\"Loremipsumdolorsitamet,consecteturadipiscingelit.\"},{\"id\":\"5725a68031fdbb1db2c1af47\",\"name\":\"Christy\",\"avatar\":\"assets/images/avatars/Christy.jpg\",\"status\":\"offline\",\"mood\":\"Loremipsumdolorsitamet,consecteturadipiscingelit.\"},{\"id\":\"5725a680bc670af746c435e2\",\"name\":\"Copeland\",\"avatar\":\"assets/images/avatars/Copeland.jpg\",\"status\":\"online\",\"mood\":\"Loremipsumdolorsitamet,consecteturadipiscingelit.\"},{\"id\":\"5725a680e7eb988a58ddf303\",\"name\":\"Estes\",\"avatar\":\"assets/images/avatars/Estes.jpg\",\"status\":\"away\",\"mood\":\"Loremipsumdolorsitamet,consecteturadipiscingelit.\"},{\"id\":\"5725a680dcb077889f758961\",\"name\":\"Harper\",\"avatar\":\"assets/images/avatars/Harper.jpg\",\"status\":\"offline\",\"mood\":\"Loremipsumdolorsitamet,consecteturadipiscingelit.\"},{\"id\":\"5725a6806acf030f9341e925\",\"name\":\"Helen\",\"avatar\":\"assets/images/avatars/Helen.jpg\",\"status\":\"away\",\"mood\":\"Loremipsumdolorsitamet,consecteturadipiscingelit.\"},{\"id\":\"5725a680ae1ae9a3c960d487\",\"name\":\"Henderson\",\"avatar\":\"assets/images/avatars/Henderson.jpg\",\"status\":\"offline\",\"mood\":\"Loremipsumdolorsitamet,consecteturadipiscingelit.\"},{\"id\":\"5725a680b8d240c011dd224b\",\"name\":\"Josefina\",\"avatar\":\"assets/images/avatars/Josefina.jpg\",\"status\":\"online\",\"mood\":\"Loremipsumdolorsitamet,consecteturadipiscingelit.\"},{\"id\":\"5725a68034cb3968e1f79eac\",\"name\":\"Katina\",\"avatar\":\"assets/images/avatars/Katina.jpg\",\"status\":\"away\",\"mood\":\"Loremipsumdolorsitamet,consecteturadipiscingelit.\"},{\"id\":\"5725a6801146cce777df2a08\",\"name\":\"Lily\",\"avatar\":\"assets/images/avatars/Lily.jpg\",\"status\":\"do-not-disturb\",\"mood\":\"Loremipsumdolorsitamet,consecteturadipiscingelit.\"},{\"id\":\"5725a6808a178bfd034d6ecf\",\"name\":\"Mai\",\"avatar\":\"assets/images/avatars/Mai.jpg\",\"status\":\"away\",\"mood\":\"Loremipsumdolorsitamet,consecteturadipiscingelit.\"},{\"id\":\"5725a680653c265f5c79b5a9\",\"name\":\"Nancy\",\"avatar\":\"assets/images/avatars/Nancy.jpg\",\"status\":\"do-not-disturb\",\"mood\":\"Loremipsumdolorsitamet,consecteturadipiscingelit.\"},{\"id\":\"5725a680bbcec3cc32a8488a\",\"name\":\"Nora\",\"avatar\":\"assets/images/avatars/Nora.jpg\",\"status\":\"do-not-disturb\",\"mood\":\"Loremipsumdolorsitamet,consecteturadipiscingelit.\"},{\"id\":\"5725a6803d87f1b77e17b62b\",\"name\":\"Odessa\",\"avatar\":\"assets/images/avatars/Odessa.jpg\",\"status\":\"away\",\"mood\":\"Loremipsumdolorsitamet,consecteturadipiscingelit.\"},{\"id\":\"5725a680e87cb319bd9bd673\",\"name\":\"Reyna\",\"avatar\":\"assets/images/avatars/Reyna.jpg\",\"status\":\"offline\",\"mood\":\"Loremipsumdolorsitamet,consecteturadipiscingelit.\"},{\"id\":\"5725a6802d10e277a0f35775\",\"name\":\"Shauna\",\"avatar\":\"assets/images/avatars/Shauna.jpg\",\"status\":\"online\",\"mood\":\"Loremipsumdolorsitamet,consecteturadipiscingelit.\",\"unread\":null},{\"id\":\"5725a680aef1e5cf26dd3d1f\",\"name\":\"Shepard\",\"avatar\":\"assets/images/avatars/Shepard.jpg\",\"status\":\"online\",\"mood\":\"Loremipsumdolorsitamet,consecteturadipiscingelit.\"},{\"id\":\"5725a680cd7efa56a45aea5d\",\"name\":\"Tillman\",\"avatar\":\"assets/images/avatars/Tillman.jpg\",\"status\":\"do-not-disturb\",\"mood\":\"\"},{\"id\":\"5725a680fb65c91a82cb35e2\",\"name\":\"Trevino\",\"avatar\":\"assets/images/avatars/Trevino.jpg\",\"status\":\"away\",\"mood\":\"Loremipsumdolorsitamet,consecteturadipiscingelit.\"},{\"id\":\"5725a68018c663044be49cbf\",\"name\":\"Tyson\",\"avatar\":\"assets/images/avatars/Tyson.jpg\",\"status\":\"do-not-disturb\",\"mood\":\"Loremipsumdolorsitamet,consecteturadipiscingelit.\"},{\"id\":\"5725a6809413bf8a0a5272b1\",\"name\":\"Velazquez\",\"avatar\":\"assets/images/avatars/Velazquez.jpg\",\"status\":\"online\",\"mood\":\"Loremipsumdolorsitamet,consecteturadipiscingelit.\"}]" ),
        Chats = JsonConvert.DeserializeObject<List<dynamic>>( "[{\"id\":\"1725a680b3249760ea21de52\",\"dialog\":[{\"who\":\"5725a680b3249760ea21de52\",\"message\":\"Quicklycometothemeetingroom1B,wehaveabigserverissue\",\"time\":\"2017-03-22T08:54:28.299Z\"},{\"who\":\"5725a6802d10e277a0f35724\",\"message\":\"I’mhavingbreakfastrightnow,can’tyouwaitfor10minutes?\",\"time\":\"2017-03-22T08:55:28.299Z\"},{\"who\":\"5725a680b3249760ea21de52\",\"message\":\"Wearelosingmoney!Quick!\",\"time\":\"2017-03-22T09:00:28.299Z\"},{\"who\":\"5725a6802d10e277a0f35724\",\"message\":\"It’snotmymoney,youknow.IwilleatmybreakfastandthenIwillcometothemeetingroom.\",\"time\":\"2017-03-22T09:02:28.299Z\"},{\"who\":\"5725a680b3249760ea21de52\",\"message\":\"Youaretheworst!\",\"time\":\"2017-03-22T09:05:28.299Z\"},{\"who\":\"5725a680b3249760ea21de52\",\"message\":\"Wearelosingmoney!Quick!\",\"time\":\"2017-03-22T09:15:28.299Z\"},{\"who\":\"5725a6802d10e277a0f35724\",\"message\":\"It’snotmymoney,youknow.IwilleatmybreakfastandthenIwillcometothemeetingroom.\",\"time\":\"2017-03-22T09:20:28.299Z\"},{\"who\":\"5725a680b3249760ea21de52\",\"message\":\"Youaretheworst!\",\"time\":\"2017-03-22T09:22:28.299Z\"},{\"who\":\"5725a680b3249760ea21de52\",\"message\":\"Wearelosingmoney!Quick!\",\"time\":\"2017-03-22T09:25:28.299Z\"},{\"who\":\"5725a6802d10e277a0f35724\",\"message\":\"It’snotmymoney,youknow.IwilleatmybreakfastandthenIwillcometothemeetingroom.\",\"time\":\"2017-03-22T09:27:28.299Z\"},{\"who\":\"5725a680b3249760ea21de52\",\"message\":\"Youaretheworst!\",\"time\":\"2017-03-22T09:33:28.299Z\"},{\"who\":\"5725a680b3249760ea21de52\",\"message\":\"Wearelosingmoney!Quick!\",\"time\":\"2017-03-22T09:35:28.299Z\"},{\"who\":\"5725a6802d10e277a0f35724\",\"message\":\"It’snotmymoney,youknow.IwilleatmybreakfastandthenIwillcometothemeetingroom.\",\"time\":\"2017-03-22T09:45:28.299Z\"},{\"who\":\"5725a680b3249760ea21de52\",\"message\":\"Youaretheworst!\",\"time\":\"2017-03-22T10:00:28.299Z\"}]},{\"id\":\"2725a680b8d240c011dd2243\",\"dialog\":[{\"who\":\"5725a680b8d240c011dd224b\",\"message\":\"Quicklycometothemeetingroom1B,wehaveabigserverissue\",\"time\":\"2017-04-22T01:00:00.299Z\"},{\"who\":\"5725a6802d10e277a0f35724\",\"message\":\"I’mhavingbreakfastrightnow,can’tyouwaitfor10minutes?\",\"time\":\"2017-04-22T01:05:00.299Z\"},{\"who\":\"5725a680b8d240c011dd224b\",\"message\":\"Wearelosingmoney!Quick!\",\"time\":\"2017-04-22T01:10:00.299Z\"}]},{\"id\":\"3725a6809413bf8a0a5272b4\",\"dialog\":[{\"who\":\"5725a6809413bf8a0a5272b1\",\"message\":\"Quicklycometothemeetingroom1B,wehaveabigserverissue\",\"time\":\"2017-04-22T02:10:00.299Z\"}]}]" ),
        User = JsonConvert.DeserializeObject<List<dynamic>>( "[{\"id\":\"5725a6802d10e277a0f35724\",\"name\":\"John Doe\",\"avatar\":\"assets/images/avatars/profile.jpg\",\"status\":\"online\",\"mood\":\"it's a status....not your diary...\",\"chatList\": [{\"id\":\"1725a680b3249760ea21de52\",\"contactId\":\"5725a680b3249760ea21de52\",\"name\":\"Alice Freeman\",\"unread\":4,\"lastMessage\":\"You are the worst!\",\"lastMessageTime\":\"2017-06-12T02:10:18.931Z\"},{\"id\":\"2725a680b8d240c011dd2243\",\"contactId\":\"5725a680b8d240c011dd224b\",\"name\":\"Josefina\",\"unread\":null,\"lastMessage\":\"We are losing money! Quick!\",\"lastMessageTime\":\"2017-02-18T10:30:18.931Z\"},{\"id\":\"3725a6809413bf8a0a5272b4\",\"contactId\":\"5725a6809413bf8a0a5272b1\",\"name\":\"Velazquez\",\"unread\":2,\"lastMessage\":\"Quickly come to the meeting room 1B, we have a big server issue\",\"lastMessageTime\":\"2017-03-18T12:30:18.931Z\"}]}]" )
      };
    }

    /// <summary>
    /// TODELETE Get all chats
    /// </summary>
    /// <returns>Returns a json array of chats</returns>
    [HttpGet( "chats" )]
    public IActionResult GetChats()
    => Ok( fakeDB.Chats );

    /// <summary>
    /// TODELETE Get a single chat 
    /// </summary>
    /// <param name="id">id of chat</param>
    /// <returns>Returns an json representation of the found chat</returns>
    [HttpGet( "chats/{id}" )]
    public IActionResult GetChats(string id) {
      
      // get chats
      var chats = fakeDB.Chats as List<dynamic>;

      // return json of chat
      return Ok( chats.Find( c => c.id == id ) );

    }

    /// <summary>
    /// TODELETE Create a new chat or update one
    /// </summary>
    /// <param name="id">id of the chat</param>
    /// <param name="rawChat">dynamic json object of new/updated chat</param>
    /// <returns>Returns the created/updated chat</returns>
    [HttpPost( "chats/{id?}" )]
    public IActionResult PostChats(string id, [FromBody] dynamic rawChat) {

      // get list of chats
      var chats = fakeDB.Chats as List<dynamic>;

      // find position in array
      var index = id == null ? -1 : chats.FindIndex(c => c.id == id);

      // replace array item or push to array
      if (index == -1)  chats.Add( rawChat );
      else              chats[index] = rawChat;

      // return created/updated chat
      return Ok( rawChat );

    }

    /// <summary>
    /// TODELETE Get user
    /// </summary>
    /// <returns>Returns a json representation of an user</returns>
    [HttpGet( "user" )]
    public IActionResult GetUser()
    => Ok( fakeDB.User );

    /// <summary>
    /// TODELETE Update user data
    /// </summary>
    /// <param name="id"></param>
    /// <param name="rawUserData"></param>
    /// <returns></returns>
    [HttpPost( "user/{id}" )]
    public IActionResult PostUser(string id, [FromBody] dynamic rawUserData) {

      // get list of users
      var users = fakeDB.User as List<dynamic>;

      // update data in fake db
      users[0] = rawUserData;

      // return user data
      return Ok( rawUserData );

    }

    /// <summary>
    /// TODELETE Get all contacts
    /// </summary>
    /// <returns>Return a json array of contacts</returns>
    [HttpGet( "contacts" )]
    public IActionResult GetContacts()
    => Ok( fakeDB.Contacts );

	}

}
