from setuptools import setup

setup(
    setup_requires=['pbr'],
    package_data={'datamined': ['datacoin/contracts/*.sol',
                                'datacoin/project.json']},
    pbr=True,
)
