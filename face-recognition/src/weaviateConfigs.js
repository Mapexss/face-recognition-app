import weaviate, { ApiKey } from 'weaviate-ts-client';

export const client = weaviate.client({
  scheme: 'https',
  host: 'facial-recognition-8lt3nxfb.weaviate.network',
  apiKey: new ApiKey('GSl938X3ToeXibFUucex1EeLGraBdWmEJHAr'),
  Headers: {
    'Access-Control-Allow-Origin': '*',
  },
});

export const generateUuid = () => {
  return (
      String('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx')
  ).replace(/[xy]/g, (character) => {
      const random = (Math.random() * 16) | 0;
      const value = character === "x" ? random : (random & 0x3) | 0x8;

      return value.toString(16);
  });
};

export const createSchema = async () => {
  const ClassDefinition = {
    class: 'Face',
    properties: [
      {
        name: 'StudentId',
        dataType: ['uuid']
      },
      {
        'name': 'name',
        'dataType': ['text']
      },
      {
        'name': 'registrationId',
        'dataType': ['text']
      },
      {
        'name': 'image',
        'dataType': ['blob']
      }
    ],
    'vectorizer': 'ref2vec-centroid',
    'moduleConfig': {
      'text2vec-huggingface': {
        'imageFields': ['image'],
        'model': 'ref2vec-centroid',
        'options': {
          'waitForModel': true,
          'skip': false,
          'useGPU': true,
          'useCache': true
        }
      }
    }
  };

  let result = await client
      .schema
      .classCreator()
      .withClass(ClassDefinition)
      .do();

  console.log("Criação do schema: " + JSON.stringify(result));
}

// export getSchemas = async () => {
//   const schemaRes = await client.schema.getter().do();
//   console.log(schemaRes);

// }


export const deleteSchema = async () => {
  const resultProp = await client
    .schema
    .classDeleter()
    .withClassName('Face')
    .do();

  console.log(JSON.stringify(resultProp, null, 2));
}

export const deleteWhere = async (where) => {
  const result = await client.batch
    .objectsBatchDeleter()
    .withClassName('Face')
    .withWhere({
      path: ['registrationId'],
      operator: 'Like',
      valueText: where,
    })
    .do();

  console.log(JSON.stringify(result, null, 2));
}



// client.schema().then((schema) => {
//     console.log(schema);
// });

// client.dataObjects.list().then((dataObjects) => {
//     console.log(dataObjects);
// });
