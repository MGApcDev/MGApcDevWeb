---
layout: post-classic
title: "Machine learning on the web, how hard can it be?"
desc: "Using Machine Learning on webpages in realtime is harder than expected."
thumbnail: ""
categories: article
tags: {}
---

### Objective:
Machine learning is cool, websites are cool. Let's put machine learning models on webpages, user can submit an image and we'll tell if the image has a cup of coffee.

### Process:
- Learn tensorflow
- Collect data to train model on
- Pre-train model to tell the difference between images
- Export model
- Import model in tensorflowJS
- Run prediction on pre-trained model

_It did not work._

### Classification

Python's Tensorflow was easy to work with, taking 250 images from Google of various coffee cups, and dividing them up into `train`, `validation`, and `test`.

We put 150 images for training, 50 images for validation during training, and 50 images for testing how we'll the model is trained.

For at classifier, we need to something to classify against. Now the idea is to classify Coffee to anything else. Now that can be a little problematic, so for now, we'll take a sample of 250 cat images and split them up in the same way.

### Preprocessing
The input images are different sizes and look very different.
We're using the VGG16 image classification model to train, and therefore we also run the VGG16 preprocessing function on the input image to increase things such as contrast, highlighting lines and colors.

```python
train_batches = ImageDataGenerator(
    preprocessing_function=tf.keras.applications.vgg16.preprocess_input
) \ .flow_from_directory(
        directory=train_path,
        target_size=(224,224),
        classes=['cat', 'coffee'],
        batch_size=10
    )
```

### Training
We slightly modified the VGG16 training model to reduce the training parameters in the output layer, as VGG16 is very general and we only need a binary output layer.
Changing out last layer to 2 nodes we reduce the time needed for training and could help accuracy.
Our activation function is softmax, so the output values are easier to work with. For no particular reason we use the Adam optimization algorithm with a learning rate of 0.0001, to avoid updates that are too drastic for finding a local minimum in gradient descent. Categorical cross-entropy will be the loss function.
We then train the model for 5 epocs.


```python
model.compile(
    optimizer=Adam(learning_rate=0.0001),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)
model.fit(x=train_batches,
    steps_per_epoch=len(train_batches),
    validation_data=valid_batches,
    validation_steps=len(valid_batches),
    epochs=5,
    verbose=2
)
```

While training we find that we quickly reach 100% accuracy on the testing set (which could be an indicator of overfitting), but as we see that it slowly increases ending on a 97.33% accuracy.

We then run the trained model on our test batch of 100 images, and see how well it perform.
He we found that all images were detected correctly.
We could spend more time on improving the model, but for the purpose of this project, this is plenty good.


```
Epoch 1/5
68/68 - 67s - loss: 0.1151 - accuracy: 0.9586 - val_loss: 0.1044 - val_accuracy: 0.9600
Epoch 2/5
68/68 - 67s - loss: 0.0177 - accuracy: 0.9956 - val_loss: 0.0737 - val_accuracy: 0.9667
Epoch 3/5
68/68 - 69s - loss: 0.0091 - accuracy: 1.0000 - val_loss: 0.0594 - val_accuracy: 0.9733
Epoch 4/5
68/68 - 72s - loss: 0.0057 - accuracy: 1.0000 - val_loss: 0.0507 - val_accuracy: 0.9733
Epoch 5/5
68/68 - 73s - loss: 0.0040 - accuracy: 1.0000 - val_loss: 0.0453 - val_accuracy: 0.9733
```


### Exporting
The simple export to H5 format is quick and simple, but will not now work in our case.
We'll need to export to ... for TensorFlow JS to understand the format and this will split up the model into 5MB files.
First problem is that our model is 500MB so this will result in 100 files.

### TensorFlow JS
TensorFlow JS, it's different... Now aside from the obvious problem of requiring the user to load 500 MB to use the model, the second more problematic issue is that to feed an image from the user to the machine learning model we need to preprocess the image in the same way it was trained.
Unfortunately the VGG16 preprocess function is not available in TensorFlow JS. Not good.

![image](https://i.gifer.com/2uA1.gif)

### A different approach
Python is flexible, why don't we make a webserver for Python and run TensorFlow directly.
Let's boot up Google Cloud Platform and use their App Engine.
Define the project setting and which packages to install.
Learn a bit about Flask and off we go.

Website is running, good. Let's try and load the Keras model... `502 bad gateway`. looking into the logs, we find that near instantly we ran out of memory. I guess expecting each request to load 500 MB of ram was a bit much.

### What did we learn?
- TensorFlow != TensorFlow JS.
- Pre-trained models can be very big.
- Webservers are not designed for single requests taking more than a few mega bytes.


If I follow up on this project again, I'll have user requests jobs to a database. Some machine will run as a queue worker listening to jobs from this database, and handle them one at a time, updating the jobs in database with the result. This way we can allow more memory used without risking concurrent users taking too much memory.
Response from the server might take some time, but prediction is pretty fast so if the model can be kept constantly in memory, response time should be fast.

#### Notes
TensorflowJS and making a Flask Tensorflow webserver is of course not useless. The above example is to highlight some of the unexpected difficulties in trying to adapt a Tensorflow project to be used on the web.