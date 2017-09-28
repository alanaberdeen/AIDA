## API
The AIDA Rest API provides a simple interface to programmatically interact with
the annotation database. The latest version of the API is available at the base url:
`https://www.api.aida.org`

#### Method categories
Methods are arranged into two categroies:
- **Core** - stable methods that serve the core funcitonality.
- **Auth** - authentication methods for access management and controlling fair usage.

#### Supported Formats
By default, data returned from a `GET` request will be in `JSON`
format. Alternative formats may be made available for some requests at a later
time. If you have any particular requirements then please get in contact.

#### Authenticating
Many of the API endpoints require authentication in order to access. For example,
any of your own annotation work or image data.

We use a token based athentication system in our API calls. Once you have
received your token simply include it as a parameter in further API calls to
successfully reach the desired endpoints.

#### Retrieve Data
API endpoints related to pulling information from the database.

##### Get Annotation 
Retrieve the annotation data assoicated with a specific image. 

|                 |                                                            |
| :---------------|:-----------------------------------------------------------|
| **Method**      | `GET`                                                      |
| **URL**         | `/trial/:trial_id/image/image_id/annotation`               |
| **URL Params**  | trial_id: `integer`  <br/> image_id: `integer`             |
| **Response**    | Content: `{annotation: [array]}`|


