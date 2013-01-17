//
//  arotdAppDelegate.h
//  arotd
//
//  Created by Yaal on 15/04/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import <UIKit/UIKit.h>

@class arotdViewController;

@interface arotdAppDelegate : NSObject <UIApplicationDelegate> {
    UIWindow *window;
    arotdViewController *viewController;
}

@property (nonatomic, retain) IBOutlet UIWindow *window;
@property (nonatomic, retain) IBOutlet arotdViewController *viewController;

@end

