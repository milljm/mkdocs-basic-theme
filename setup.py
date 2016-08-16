from setuptools import setup, find_packages

VERSION = '1.0.1'


setup(
    name="mkdocs-moosedocs",
    version=VERSION,
    url='https://github.com/mkdocs/mkdocs-basic-theme',
    license='LGPL',
    description='MOOSE Theme',
    author='Dougal Matthews',
    author_email='m.jason.miller@gmail.com.com',
    packages=find_packages(),
    include_package_data=True,
    entry_points={
        'mkdocs.themes': [
            'moosedocs = moose_docs',
        ]
    },
    zip_safe=False
)
