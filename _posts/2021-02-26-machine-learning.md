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
We're using the VGG16 image analysis model to train, so we need to run a preprocessing function to increase contrast in lines and colors.

### Training
We slightly modified the VGG16 training model to reduce the training parameters in the output layer.
Epocs, learning rate.
... we got % accuracy on the testing set after training.

### Exporting
The simple export to H5 format is quick and simple, but will not now work in our case.
We'll need to export to ... for TensorFlow JS to understand the format and this will split up the model into 5MB files.
First problem is that our model is 500MB so this will result in 100 files.

### TensorFlow JS
TensorFlow JS, it's different... Now aside from the obvious problem of requiring the user to load 500 MB to use the model, the second more problematic issue is that to feed an image from the user to the machine learning model we need to preprocess the image in the same way it was trained.
Unfortunately  the VGG15 preprocess function is not available in TensorFlow JS. Not good.

![image](https://i.gifer.com/2uA1.gif)

### A different approach
Python is flexible, why don't we make a webserver for Python and run TensorFlow directly.
Let's boot up Google Cloud Platform and use their App Engine.
Define the project setting and which packages to install.
Learn a bit about Flask and off we go.

`502 bad gateway` looking into the logs, we find that near instantly we ran out of memory. I guess expecting each request to load 500 MB of ram was a bit much.

### What did we learn?
- TensorFlow != TensorFlow JS.
- Pre-trained models can be very big.
- Webservers are not designed for single requests taking more than a few mega bytes.

If I follow up on this project again, I'll have user requests jobs to database. Some machine will run as a queue worker listening to jobs from this database, and handle them one at a time, updating the jobs in database with the result. This way we can allow more memory used without risking multiple users taking too much memory.
Response from the server might take some time, prediction is pretty fast so if the model can be kept constantly in memory, response time should be fast.