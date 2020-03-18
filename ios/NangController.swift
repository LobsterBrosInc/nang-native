//
//  NangController.swift
//  NANG
//
//  Created by Reade Lobdill on 10/12/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation

@objc(NangController)
class NangController: NSObject {
  
  let SpotifyClientID = "dd6edb4eff804d17a9b98587877a166c"
  let SpotifyRedirectURL = URL(string: "nang://spotify-login-callback")!
//
//  lazy var configuration = SPTConfiguration(
//    clientID: SpotifyClientID,
//    redirectURL: SpotifyRedirectURL
//  )
  
  @objc func startSession() -> Void{
    print("NANG")
  }
  
  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
