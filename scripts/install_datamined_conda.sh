#!/usr/bin/env bash
# Used to make a conda environment with datamined 

# Change commented out line For gpu tensorflow
#export tensorflow=tensorflow-gpu
export tensorflow=tensorflow


if [ -z "$1" ]
then
    echo "Must Specify Conda Environment Name"
fi

if [ -z "$python_version" ]
then
    echo "Using python 3.5 by default"
    export python_version=3.5
fi

export envname=$1
conda create -y --name $envname python=$python_version
source activate $envname
conda install -y -q -c pip 
conda install numpy
pip install populus
pip install nose
